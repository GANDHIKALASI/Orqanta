"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Activates subscription for the current user's organization.
 * Sets subscription_status to 'active' and redirects to /dashboard.
 */
export async function activateSubscriptionAction(plan: "monthly" | "annual" = "monthly") {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get user profile to find organization
  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    throw new Error("User does not belong to an organization");
  }

  const admin = createAdminClient();

  // Fetch current organization feature flags
  const { data: org } = await admin
    .from("organizations")
    .select("feature_flags")
    .eq("id", profile.org_id)
    .single();

  const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
  const updatedFlags = {
    ...currentFlags,
    subscription_status: "active",
    plan,
    activated_at: new Date().toISOString(),
  };

  // Try updating the direct column as well as feature_flags
  const { error: directUpdateError } = await admin
    .from("organizations")
    .update({
      subscription_status: "active",
      feature_flags: updatedFlags,
    })
    .eq("id", profile.org_id);

  if (directUpdateError) {
    // If column not available in schema cache yet, update feature_flags
    await admin
      .from("organizations")
      .update({
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/billing");
  redirect("/dashboard");
}

/**
 * Helper action to mock-lock subscription for quick testing of paywall
 */
export async function mockLockSubscriptionAction() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    throw new Error("User does not belong to an organization");
  }

  const admin = createAdminClient();
  const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: org } = await admin
    .from("organizations")
    .select("feature_flags")
    .eq("id", profile.org_id)
    .single();

  const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
  const updatedFlags = {
    ...currentFlags,
    subscription_status: "locked",
    trial_ends_at: expiredDate,
  };

  const { error } = await admin
    .from("organizations")
    .update({
      subscription_status: "locked",
      trial_ends_at: expiredDate,
      feature_flags: updatedFlags,
    })
    .eq("id", profile.org_id);

  if (error) {
    await admin
      .from("organizations")
      .update({
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/billing");
  redirect("/billing");
}
