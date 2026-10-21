"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviteTenantSchema, type InviteTenantInput } from "@/lib/validators";
import type { ActionResult } from "@/lib/types";
import { Resend } from "resend";

export async function inviteTenantAction(rawInput: InviteTenantInput): Promise<ActionResult> {
  const parsed = inviteTenantSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid tenant details",
    };
  }

  try {
    const supabase = createClient();
    const admin = createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const { data: managerProfile } = await supabase
      .from("profiles")
      .select("org_id, organization:organizations(name)")
      .eq("id", user.id)
      .single();

    if (!managerProfile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const email = parsed.data.email.trim().toLowerCase();
    const tempPassword = Math.random().toString(36).substring(2, 12) + "A1!";

    // 1. Create or fetch user via admin client
    const { data: authUser, error: authError } = await admin.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
      app_metadata: {
        org_id: managerProfile.org_id,
        role: "tenant",
      },
      user_metadata: {
        full_name: parsed.data.fullName.trim(),
      },
    });

    if (authError || !authUser.user) {
      return { success: false, error: authError?.message || "Failed to create tenant user" };
    }

    // 2. Insert into public.profiles
    const { error: profileError } = await admin.from("profiles").upsert({
      id: authUser.user.id,
      org_id: managerProfile.org_id,
      role: "tenant",
      property_id: parsed.data.propertyId,
      unit_number: parsed.data.unitNumber.trim(),
      full_name: parsed.data.fullName.trim(),
      phone: parsed.data.phone?.trim() || null,
      email,
    });

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // 3. Send invitation email via Resend if configured
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.startsWith("re_")) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const orgName = (managerProfile.organization as any)?.name || "Your Property Management";
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: email,
          subject: `You've been invited to ${orgName} Tenant Portal`,
          html: `
            <h2>Welcome to your tenant portal, ${parsed.data.fullName}!</h2>
            <p>You can now submit and track maintenance requests directly for unit ${parsed.data.unitNumber}.</p>
            <p><strong>Your temporary password:</strong> <code>${tempPassword}</code></p>
            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login">Sign in to your portal</a></p>
          `,
        });
      } catch (emailErr) {
        console.warn("Tenant email notification failed (non-blocking):", emailErr);
      }
    }

    revalidatePath("/tenants");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to invite tenant",
    };
  }
}
