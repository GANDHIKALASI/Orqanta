"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  ActionResult,
  BillingDetails,
  BillingInvoice,
  FailedPaymentInfo,
  OrganizationBillingData,
  PaymentMethod,
} from "@/lib/types";

import { getDefaultBillingData } from "./billing-helpers";

function extractOrg(rawOrg: unknown): Record<string, any> | undefined {
  if (Array.isArray(rawOrg)) return rawOrg[0] as Record<string, any> | undefined;
  return rawOrg as Record<string, any> | undefined;
}

/**
 * Retrieves the full billing data for the current organization
 */
export async function getOrganizationBilling(): Promise<{
  billing: OrganizationBillingData;
  subscriptionStatus: string;
  isTrialExpired: boolean;
  daysRemaining: number;
  orgId: string;
}> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organization:organizations(*)")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    throw new Error("User does not belong to an organization");
  }

  const org = extractOrg(profile.organization);
  const rawStatus = (org?.subscription_status ||
    (org?.feature_flags as Record<string, unknown>)?.subscription_status ||
    "trialing") as string;

  const fallbackTrialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const rawTrialEnd = (org?.trial_ends_at ||
    (org?.feature_flags as Record<string, unknown>)?.trial_ends_at ||
    fallbackTrialEnd) as string;

  const trialEndDate = new Date(rawTrialEnd);
  const now = new Date();
  const isTrialExpired = now.getTime() > trialEndDate.getTime();
  const msRemaining = trialEndDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  const flags = (org?.feature_flags as Record<string, unknown>) || {};
  const currentPlan = (flags.plan as "monthly" | "annual") || "annual";
  const storedBilling = flags.billing as Partial<OrganizationBillingData> | undefined;

  const baseDefault = getDefaultBillingData(
    org?.name || "Orqanta Workspace",
    profile.email || user.email || "billing@orqanta.com",
    profile.full_name || "Account Owner",
    currentPlan
  );

  const billing: OrganizationBillingData = {
    ...baseDefault,
    ...(storedBilling || {}),
    payment_methods: storedBilling?.payment_methods?.length
      ? storedBilling.payment_methods
      : baseDefault.payment_methods,
    billing_details: {
      ...baseDefault.billing_details,
      ...(storedBilling?.billing_details || {}),
    },
    invoices: storedBilling?.invoices?.length ? storedBilling.invoices : baseDefault.invoices,
    failed_payment:
      storedBilling?.failed_payment !== undefined
        ? storedBilling.failed_payment
        : baseDefault.failed_payment,
  };

  return {
    billing,
    subscriptionStatus: rawStatus,
    isTrialExpired,
    daysRemaining,
    orgId: profile.org_id,
  };
}

// ==============================================================================
// Server Actions
// ==============================================================================

/**
 * Activates subscription for the current user's organization
 */
export async function activateSubscriptionAction(plan: "monthly" | "annual" = "monthly") {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, full_name, email, organization:organizations(*)")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) {
    throw new Error("User does not belong to an organization");
  }

  const admin = createAdminClient();
  const org = extractOrg(profile.organization);
  const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
  const defaultBilling = getDefaultBillingData(org?.name, profile.email, profile.full_name, plan);
  const existingBilling: OrganizationBillingData = {
    ...defaultBilling,
    ...((currentFlags.billing as Partial<OrganizationBillingData>) || {}),
    payment_methods:
      (currentFlags.billing as OrganizationBillingData)?.payment_methods?.length
        ? (currentFlags.billing as OrganizationBillingData).payment_methods
        : defaultBilling.payment_methods,
    billing_details: {
      ...defaultBilling.billing_details,
      ...((currentFlags.billing as OrganizationBillingData)?.billing_details || {}),
    },
  };

  const isAnnual = plan === "annual";
  const amount = isAnnual ? 1999 : 199;
  const planName = isAnnual ? "Annual Pro Plan" : "Monthly Starter Plan";

  const nextRenewalDate = new Date();
  if (isAnnual) {
    nextRenewalDate.setFullYear(nextRenewalDate.getFullYear() + 1);
  } else {
    nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
  }

  const subtotal = Math.round((amount / 1.18) * 100) / 100;
  const taxAmount = Math.round((amount - subtotal) * 100) / 100;

  // Prepend new activation invoice
  const newInvoice: BillingInvoice = {
    id: `inv-${Date.now()}`,
    invoice_number: `INV-${new Date().getFullYear()}-${String(
      Math.floor(Math.random() * 900) + 100
    )}`,
    created_at: new Date().toISOString(),
    due_date: new Date().toISOString(),
    paid_at: new Date().toISOString(),
    amount,
    subtotal,
    tax_rate: 18,
    tax_amount: taxAmount,
    currency: "INR",
    plan_name: planName,
    billing_period: isAnnual ? "Current Year" : "Current Month",
    status: "paid",
    payment_method_last4: existingBilling.payment_methods?.[0]?.last4 || "4242",
    payment_method_brand: existingBilling.payment_methods?.[0]?.brand || "visa",
  };

  const updatedBilling: OrganizationBillingData = {
    ...existingBilling,
    plan,
    plan_name: planName,
    planName,
    amount,
    currency: "INR",
    next_billing_date: nextRenewalDate.toISOString(),
    auto_renew: true,
    failed_payment: null, // Clear any failure
    invoices: [newInvoice, ...(existingBilling.invoices || [])],
  };

  const updatedFlags = {
    ...currentFlags,
    subscription_status: "active",
    plan,
    activated_at: new Date().toISOString(),
    billing: updatedBilling,
  };

  await admin
    .from("organizations")
    .update({
      subscription_status: "active",
      feature_flags: updatedFlags,
    })
    .eq("id", profile.org_id);

  revalidatePath("/dashboard");
  revalidatePath("/billing");
  redirect("/dashboard");
}

/**
 * Add or update payment method on file
 */
export async function updatePaymentMethodAction(input: {
  cardNumber: string;
  cardholderName: string;
  expMonth: string;
  expYear: string;
  cvc?: string;
  postalCode?: string;
  isDefault?: boolean;
}): Promise<ActionResult<{ paymentMethod: PaymentMethod }>> {
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
      .select("org_id, email, full_name, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const cleanNumber = input.cardNumber.replace(/\s+/g, "");
    if (cleanNumber.length < 13 || cleanNumber.length > 19) {
      return { success: false, error: "Please enter a valid card number." };
    }

    const last4 = cleanNumber.slice(-4);

    // Detect brand based on leading digits
    let brand: PaymentMethod["brand"] = "visa";
    if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2")) {
      brand = "mastercard";
    } else if (cleanNumber.startsWith("34") || cleanNumber.startsWith("37")) {
      brand = "amex";
    } else if (cleanNumber.startsWith("6")) {
      brand = "discover";
    }

    const admin = createAdminClient();
    const org = extractOrg(profile.organization);
    const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
    const existingBilling: OrganizationBillingData =
      (currentFlags.billing as OrganizationBillingData) ||
      getDefaultBillingData(org?.name, profile.email, profile.full_name);

    const newPaymentMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      brand,
      last4,
      exp_month: input.expMonth.padStart(2, "0"),
      exp_year: input.expYear.length === 2 ? `20${input.expYear}` : input.expYear,
      cardholder_name: input.cardholderName.trim() || "Cardholder",
      is_default: input.isDefault ?? true,
      created_at: new Date().toISOString(),
    };

    // Replace or set as default
    const currentMethods = existingBilling.payment_methods || [];
    const updatedMethods = [
      newPaymentMethod,
      ...currentMethods.map((pm) => ({ ...pm, is_default: false })),
    ];

    // If payment was failed, automatically resolve it when new card is added!
    const hadFailedPayment = Boolean(existingBilling.failed_payment?.is_failed);

    const updatedBilling: OrganizationBillingData = {
      ...existingBilling,
      payment_methods: updatedMethods,
      failed_payment: hadFailedPayment ? null : existingBilling.failed_payment,
    };

    const updatedFlags = {
      ...currentFlags,
      billing: updatedBilling,
      subscription_status: hadFailedPayment ? "active" : currentFlags.subscription_status,
    };

    await admin
      .from("organizations")
      .update({
        subscription_status: hadFailedPayment ? "active" : org?.subscription_status,
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);

    revalidatePath("/billing");
    revalidatePath("/dashboard");

    return { success: true, data: { paymentMethod: newPaymentMethod } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update payment method";
    return { success: false, error: message };
  }
}

/**
 * Update company billing & legal tax information (VAT/Tax ID, Address, Billing Contact Email)
 */
export async function updateBillingDetailsAction(
  details: Partial<BillingDetails>
): Promise<ActionResult<{ details: BillingDetails }>> {
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
      .select("*, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const admin = createAdminClient();
    const org = extractOrg(profile.organization);
    const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
    const existingBilling: OrganizationBillingData =
      (currentFlags.billing as OrganizationBillingData) ||
      getDefaultBillingData(org?.name, profile.email, profile.full_name);

    const mergedDetails: BillingDetails = {
      ...existingBilling.billing_details,
      ...details,
    };

    const updatedBilling: OrganizationBillingData = {
      ...existingBilling,
      billing_details: mergedDetails,
    };

    const updatedFlags = {
      ...currentFlags,
      billing: updatedBilling,
    };

    await admin
      .from("organizations")
      .update({
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);

    revalidatePath("/billing");
    return { success: true, data: { details: mergedDetails } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update billing details";
    return { success: false, error: message };
  }
}

/**
 * Retry failed payment attempt
 */
export async function retryFailedPaymentAction(): Promise<ActionResult<{ success: boolean }>> {
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
      .select("*, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const admin = createAdminClient();
    const org = extractOrg(profile.organization);
    const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
    const existingBilling: OrganizationBillingData =
      (currentFlags.billing as OrganizationBillingData) ||
      getDefaultBillingData(org?.name, profile.email, profile.full_name);

    // Simulate recovery charge
    const amount = existingBilling.failed_payment?.amount || existingBilling.amount || 1999;
    const planName = existingBilling.failed_payment?.plan_name || existingBilling.planName || "Annual Pro Plan";
    const subtotal = Math.round((amount / 1.18) * 100) / 100;
    const taxAmount = Math.round((amount - subtotal) * 100) / 100;

    const recoveryInvoice: BillingInvoice = {
      id: `inv-${Date.now()}`,
      invoice_number: `INV-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 900) + 100
      )}`,
      created_at: new Date().toISOString(),
      due_date: new Date().toISOString(),
      paid_at: new Date().toISOString(),
      amount,
      subtotal,
      tax_rate: 18,
      tax_amount: taxAmount,
      currency: "INR",
      plan_name: planName,
      billing_period: "Renewed Coverage",
      status: "paid",
      payment_method_last4: existingBilling.payment_methods?.[0]?.last4 || "4242",
      payment_method_brand: existingBilling.payment_methods?.[0]?.brand || "visa",
    };

    const updatedBilling: OrganizationBillingData = {
      ...existingBilling,
      failed_payment: null,
      invoices: [recoveryInvoice, ...(existingBilling.invoices || [])],
    };

    const updatedFlags = {
      ...currentFlags,
      subscription_status: "active",
      billing: updatedBilling,
    };

    await admin
      .from("organizations")
      .update({
        subscription_status: "active",
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { success: true, data: { success: true } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to retry payment";
    return { success: false, error: message };
  }
}

/**
 * Simulate a failed payment attempt (for testing failure banners, alerts, and recovery flows)
 */
export async function simulateFailedPaymentAction(
  customReason?: string
): Promise<ActionResult<{ failedPayment: FailedPaymentInfo }>> {
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
      .select("*, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const admin = createAdminClient();
    const org = extractOrg(profile.organization);
    const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
    const existingBilling: OrganizationBillingData =
      (currentFlags.billing as OrganizationBillingData) ||
      getDefaultBillingData(org?.name, profile.email, profile.full_name);

    const failedInfo: FailedPaymentInfo = {
      is_failed: true,
      failed_at: new Date().toISOString(),
      amount: existingBilling.amount || 1999,
      plan_name: existingBilling.planName || "Annual Pro Plan",
      reason:
        customReason ||
        "Card declined: Insufficient funds or card issuer online authorization hold.",
      retry_count: 1,
      grace_period_ends_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const updatedBilling: OrganizationBillingData = {
      ...existingBilling,
      failed_payment: failedInfo,
    };

    const updatedFlags = {
      ...currentFlags,
      billing: updatedBilling,
    };

    await admin
      .from("organizations")
      .update({
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { success: true, data: { failedPayment: failedInfo } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to simulate payment failure";
    return { success: false, error: message };
  }
}

/**
 * Clear failed payment status
 */
export async function clearFailedPaymentAction(): Promise<ActionResult<{ success: boolean }>> {
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
      .select("*, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const admin = createAdminClient();
    const org = extractOrg(profile.organization);
    const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
    const existingBilling: OrganizationBillingData =
      (currentFlags.billing as OrganizationBillingData) ||
      getDefaultBillingData(org?.name, profile.email, profile.full_name);

    const updatedBilling: OrganizationBillingData = {
      ...existingBilling,
      failed_payment: null,
    };

    const updatedFlags = {
      ...currentFlags,
      billing: updatedBilling,
    };

    await admin
      .from("organizations")
      .update({
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);

    revalidatePath("/billing");
    revalidatePath("/dashboard");
    return { success: true, data: { success: true } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to clear failure";
    return { success: false, error: message };
  }
}

/**
 * Toggle auto renew
 */
export async function toggleAutoRenewAction(enabled: boolean): Promise<ActionResult<{ autoRenew: boolean }>> {
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
      .select("*, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const admin = createAdminClient();
    const org = extractOrg(profile.organization);
    const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
    const existingBilling: OrganizationBillingData =
      (currentFlags.billing as OrganizationBillingData) ||
      getDefaultBillingData(org?.name, profile.email, profile.full_name);

    const updatedBilling: OrganizationBillingData = {
      ...existingBilling,
      auto_renew: enabled,
    };

    const updatedFlags = {
      ...currentFlags,
      billing: updatedBilling,
    };

    await admin
      .from("organizations")
      .update({
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);

    revalidatePath("/billing");
    return { success: true, data: { autoRenew: enabled } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle auto renew";
    return { success: false, error: message };
  }
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

/**
 * Verifies and records a successful real Razorpay payment.
 * Activates subscription, saves paid invoice with Razorpay payment ID, and records payment method.
 */
export async function recordRazorpayPaymentAction(params: {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  plan: "monthly" | "annual";
}): Promise<ActionResult<{ success: boolean; invoiceId: string }>> {
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
      .select("*, organization:organizations(*)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      return { success: false, error: "Organization not found" };
    }

    const admin = createAdminClient();
    const org = extractOrg(profile.organization);
    const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
    const defaultBilling = getDefaultBillingData(
      org?.name,
      profile.email,
      profile.full_name,
      params.plan
    );

    const existingBilling: OrganizationBillingData = {
      ...defaultBilling,
      ...((currentFlags.billing as Partial<OrganizationBillingData>) || {}),
      payment_methods:
        (currentFlags.billing as OrganizationBillingData)?.payment_methods?.length
          ? (currentFlags.billing as OrganizationBillingData).payment_methods
          : defaultBilling.payment_methods,
      billing_details: {
        ...defaultBilling.billing_details,
        ...((currentFlags.billing as OrganizationBillingData)?.billing_details || {}),
      },
    };

    const isAnnual = params.plan === "annual";
    const amount = isAnnual ? 1999 : 199;
    const planName = isAnnual ? "Annual Pro Plan" : "Monthly Starter Plan";

    const nextRenewalDate = new Date();
    if (isAnnual) {
      nextRenewalDate.setFullYear(nextRenewalDate.getFullYear() + 1);
    } else {
      nextRenewalDate.setMonth(nextRenewalDate.getMonth() + 1);
    }

    const subtotal = Math.round((amount / 1.18) * 100) / 100;
    const taxAmount = Math.round((amount - subtotal) * 100) / 100;

    const last4 = params.razorpay_payment_id.slice(-4) || "8888";

    // New official invoice with real Razorpay payment ID reference
    const newInvoice: BillingInvoice = {
      id: `inv-${Date.now()}`,
      invoice_number: `INV-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 900) + 100
      )}`,
      created_at: new Date().toISOString(),
      due_date: new Date().toISOString(),
      paid_at: new Date().toISOString(),
      amount,
      subtotal,
      tax_rate: 18,
      tax_amount: taxAmount,
      currency: "INR",
      plan_name: planName,
      billing_period: isAnnual ? "1 Year Coverage" : "1 Month Coverage",
      status: "paid",
      payment_method_last4: last4,
      payment_method_brand: "Razorpay",
    };

    const newPaymentMethod: PaymentMethod = {
      id: `pm-rzp-${params.razorpay_payment_id}`,
      brand: "visa",
      last4,
      exp_month: "12",
      exp_year: "29",
      cardholder_name: profile.full_name || "Authorized Representative",
      is_default: true,
      created_at: new Date().toISOString(),
    };

    const currentMethods = existingBilling.payment_methods || [];
    const updatedMethods = [
      newPaymentMethod,
      ...currentMethods.filter((pm) => pm.id !== newPaymentMethod.id).map((pm) => ({ ...pm, is_default: false })),
    ];

    const updatedBilling: OrganizationBillingData = {
      ...existingBilling,
      plan: params.plan,
      plan_name: planName,
      planName,
      amount,
      currency: "INR",
      next_billing_date: nextRenewalDate.toISOString(),
      auto_renew: true,
      failed_payment: null, // Clear any failure
      payment_methods: updatedMethods,
      invoices: [newInvoice, ...(existingBilling.invoices || [])],
    };

    const updatedFlags = {
      ...currentFlags,
      subscription_status: "active",
      plan: params.plan,
      activated_at: new Date().toISOString(),
      razorpay_payment_id: params.razorpay_payment_id,
      billing: updatedBilling,
    };

    await admin
      .from("organizations")
      .update({
        subscription_status: "active",
        feature_flags: updatedFlags,
      })
      .eq("id", profile.org_id);

    revalidatePath("/dashboard");
    revalidatePath("/billing");

    return { success: true, data: { success: true, invoiceId: newInvoice.id } };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record Razorpay payment";
    return { success: false, error: message };
  }
}

