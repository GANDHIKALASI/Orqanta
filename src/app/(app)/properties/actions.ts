"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { propertySchema, type PropertyInput } from "@/lib/validators";
import type { ActionResult } from "@/lib/types";

export async function createPropertyAction(rawInput: PropertyInput): Promise<ActionResult> {
  const parsed = propertySchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid property information",
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

    const { error } = await supabase.from("properties").insert({
      org_id: profile.org_id,
      name: parsed.data.name.trim(),
      address: parsed.data.address.trim(),
      owner_name: parsed.data.owner_name?.trim() || null,
      owner_email: parsed.data.owner_email?.trim() || null,
      units: parsed.data.units,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/properties");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create property",
    };
  }
}

export async function deletePropertyAction(propertyId: string): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("properties").delete().eq("id", propertyId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/properties");
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to delete property",
    };
  }
}
