"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createWorkOrderSchema,
  updateWorkOrderStatusSchema,
  assignVendorSchema,
  type CreateWorkOrderInput,
} from "@/lib/validators";
import type { ActionResult, WorkOrderStatus } from "@/lib/types";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Resend } from "resend";

/**
 * Async non-blocking AI triage powered by Google Gemini
 */
async function runAiTriageAsync(params: {
  workOrderId: string;
  title: string;
  description: string;
  propertyName?: string;
}) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return;

  try {
    const genAI = new GoogleGenerativeAI(geminiKey);
    // Use gemini-3.8-flash (tested and verified)
    const model = genAI.getGenerativeModel({
      model: "gemini-3.8-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `
You are an expert property maintenance dispatcher. Analyze the following maintenance request and return valid JSON with:
1. "category": one of ["plumbing", "electrical", "hvac", "appliance", "roofing", "carpentry", "pest_control", "general_handyman", "other"]
2. "suggested_priority": one of ["low", "medium", "high", "urgent"]
3. "summary": a single concise sentence summarizing the core repair needed.

Title: ${params.title}
Description: ${params.description}
Property: ${params.propertyName || "Apartment complex"}
`;

    const result = await model.generateContent(prompt);
    const parsed = JSON.parse(result.response.text());

    if (parsed.category || parsed.summary) {
      const admin = createAdminClient();
      await admin
        .from("work_orders")
        .update({
          ai_category: parsed.category,
          ai_summary: parsed.summary,
        })
        .eq("id", params.workOrderId);

      await admin.from("activity_log").insert({
        work_order_id: params.workOrderId,
        org_id: (
          await admin.from("work_orders").select("org_id").eq("id", params.workOrderId).single()
        ).data?.org_id,
        action: "ai.triaged",
        meta: {
          category: parsed.category,
          suggested_priority: parsed.suggested_priority,
          summary: parsed.summary,
        },
      });
    }
  } catch (err) {
    console.warn("AI Triage non-blocking error:", err);
  }
}

export async function createWorkOrderAction(rawInput: CreateWorkOrderInput): Promise<ActionResult<{ id: string }>> {
  const parsed = createWorkOrderSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid work order details",
    };
  }

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id, role")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    // 1. Insert Work Order
    const { data: workOrder, error: woError } = await supabase
      .from("work_orders")
      .insert({
        org_id: profile.org_id,
        property_id: parsed.data.property_id,
        unit_number: parsed.data.unit_number?.trim() || null,
        tenant_id: profile.role === "tenant" ? user.id : null,
        title: parsed.data.title.trim(),
        description: parsed.data.description.trim(),
        priority: parsed.data.priority,
        status: "open",
        photo_keys: parsed.data.photo_keys || [],
        source: profile.role === "tenant" ? "portal" : "portal",
      })
      .select("id, title, description, property:properties(name)")
      .single();

    if (woError || !workOrder) {
      return { success: false, error: woError?.message || "Failed to create work order" };
    }

    // 2. Write initial activity log
    await supabase.from("activity_log").insert({
      org_id: profile.org_id,
      work_order_id: workOrder.id,
      actor_id: user.id,
      action: "work_order.created",
      meta: {
        title: parsed.data.title,
        priority: parsed.data.priority,
      },
    });

    // 3. Fire-and-forget AI triage in background
    runAiTriageAsync({
      workOrderId: workOrder.id,
      title: workOrder.title,
      description: workOrder.description,
      propertyName: (workOrder.property as any)?.name,
    }).catch(console.error);

    revalidatePath("/work-orders");
    revalidatePath("/dashboard");
    return { success: true, data: { id: workOrder.id } };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create work order",
    };
  }
}

export async function updateWorkOrderStatusAction(
  workOrderId: string,
  newStatus: WorkOrderStatus
): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: wo, error: fetchErr } = await supabase
      .from("work_orders")
      .select("org_id, status")
      .eq("id", workOrderId)
      .single();

    if (fetchErr || !wo) {
      return { success: false, error: "Work order not found" };
    }

    const { error } = await supabase
      .from("work_orders")
      .update({ status: newStatus })
      .eq("id", workOrderId);

    if (error) {
      return { success: false, error: error.message };
    }

    await supabase.from("activity_log").insert({
      org_id: wo.org_id,
      work_order_id: workOrderId,
      actor_id: user.id,
      action: "status.changed",
      meta: {
        old_status: wo.status,
        new_status: newStatus,
      },
    });

    revalidatePath(`/work-orders/${workOrderId}`);
    revalidatePath("/work-orders");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update status",
    };
  }
}

export async function assignVendorAction(
  workOrderId: string,
  vendorId: string | null
): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: wo } = await supabase
      .from("work_orders")
      .select("*, property:properties(name, address)")
      .eq("id", workOrderId)
      .single();

    if (!wo) {
      return { success: false, error: "Work order not found" };
    }

    const { error } = await supabase
      .from("work_orders")
      .update({ vendor_id: vendorId })
      .eq("id", workOrderId);

    if (error) {
      return { success: false, error: error.message };
    }

    await supabase.from("activity_log").insert({
      org_id: wo.org_id,
      work_order_id: workOrderId,
      actor_id: user.id,
      action: vendorId ? "vendor.assigned" : "vendor.unassigned",
      meta: { vendor_id: vendorId },
    });

    // Notify vendor via Resend email if assigned
    if (vendorId && process.env.RESEND_API_KEY) {
      try {
        const { data: vendor } = await supabase.from("vendors").select("*").eq("id", vendorId).single();
        if (vendor?.email) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
            to: vendor.email,
            subject: `New Maintenance Job Assignment: ${wo.title}`,
            html: `
              <h3>Job Assigned: ${wo.title}</h3>
              <p><strong>Property:</strong> ${(wo.property as any)?.name} (${(wo.property as any)?.address})</p>
              <p><strong>Unit:</strong> ${wo.unit_number || "Building"}</p>
              <p><strong>Priority:</strong> ${wo.priority}</p>
              <p><strong>Details:</strong> ${wo.description}</p>
            `,
          });
        }
      } catch (emailErr) {
        console.warn("Vendor assignment email failed (non-blocking):", emailErr);
      }
    }

    revalidatePath(`/work-orders/${workOrderId}`);
    revalidatePath("/work-orders");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to assign vendor",
    };
  }
}
