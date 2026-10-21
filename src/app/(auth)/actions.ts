"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, signupSchema, type LoginInput, type SignupInput } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "@/lib/types";

/**
 * Creates the initial organization, manager profile, and updates the JWT claims.
 * Uses the service-role admin client to bypass initial unauthenticated RLS.
 */
async function bootstrapOrg(params: {
  userId: string;
  email: string;
  fullName: string;
  orgName: string;
}): Promise<{ orgId: string; slug: string }> {
  const admin = createAdminClient();

  const baseSlug = slugify(params.orgName) || "org";
  const uniqueSuffix = Math.random().toString(36).substring(2, 6);
  const slug = `${baseSlug}-${uniqueSuffix}`;
  const apiKey = `ok_live_${crypto.randomUUID().replace(/-/g, "")}`;

  // 1. Create Organization
  const { data: org, error: orgError } = await admin
    .from("organizations")
    .insert({
      name: params.orgName.trim(),
      slug,
      api_key: apiKey,
      feature_flags: {
        ai_triage: true,
        ai_vendor_suggestion: true,
        ai_draft_message: true,
        ai_monthly_report: true,
        ai_duplicate_detect: true,
        sdk_enabled: true,
        api_enabled: true,
      },
    })
    .select("id, slug")
    .single();

  if (orgError || !org) {
    throw new Error(`Failed to create organization: ${orgError?.message || "Unknown error"}`);
  }

  // 2. Create Profile for Manager
  const { error: profileError } = await admin.from("profiles").insert({
    id: params.userId,
    org_id: org.id,
    role: "manager",
    full_name: params.fullName.trim(),
    email: params.email.trim().toLowerCase(),
  });

  if (profileError) {
    // Clean up created org if profile creation fails
    await admin.from("organizations").delete().eq("id", org.id);
    throw new Error(`Failed to create user profile: ${profileError.message}`);
  }

  // 3. Update Supabase Auth app_metadata with org_id and role
  const { error: authUpdateError } = await admin.auth.admin.updateUserById(params.userId, {
    app_metadata: {
      org_id: org.id,
      role: "manager",
    },
  });

  if (authUpdateError) {
    console.warn("Notice: Auth app_metadata update failed:", authUpdateError.message);
  }

  return { orgId: org.id, slug: org.slug };
}

/**
 * Sign in action
 */
export async function loginAction(rawInput: LoginInput): Promise<ActionResult> {
  const parsed = loginSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid credentials",
    };
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Unable to sign in. Please try again." };
    }

    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    console.error("Login unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}

/**
 * Sign up action with automated bootstrap
 */
export async function signupAction(rawInput: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid signup details",
    };
  }

  try {
    const supabase = createClient();
    const email = parsed.data.email.trim().toLowerCase();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: parsed.data.password,
      options: {
        data: {
          full_name: parsed.data.fullName.trim(),
          org_name: parsed.data.orgName.trim(),
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return {
        success: false,
        error: "Sign up succeeded but user session could not be established.",
      };
    }

    // Bootstrap the organization, manager profile, and app_metadata
    await bootstrapOrg({
      userId: authData.user.id,
      email,
      fullName: parsed.data.fullName,
      orgName: parsed.data.orgName,
    });

    // Refresh the user session so the JWT token receives the newly injected claims
    await supabase.auth.refreshSession();

    revalidatePath("/", "layout");
    return { success: true, data: undefined };
  } catch (err: unknown) {
    console.error("Signup unexpected error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create organization account",
    };
  }
}

/**
 * Sign out action
 */
export async function logoutAction(): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
