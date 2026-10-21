"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { vendorSchema, type VendorInput } from "@/lib/validators";
import type { ActionResult } from "@/lib/types";

export async function createVendorAction(rawInput: VendorInput): Promise<ActionResult> {
  const parsed = vendorSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid vendor details",
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
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const { error } = await supabase.from("vendors").insert({
      org_id: profile.org_id,
      name: parsed.data.name.trim(),
      trade: parsed.data.trade,
      phone: parsed.data.phone?.trim() || null,
      email: parsed.data.email.trim().toLowerCase(),
      rate_notes: parsed.data.rate_notes?.trim() || null,
      insurance_expiry: parsed.data.insurance_expiry || null,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/vendors");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to add vendor",
    };
  }
}

export async function deleteVendorAction(vendorId: string): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("vendors").delete().eq("id", vendorId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/vendors");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete vendor",
    };
  }
}
