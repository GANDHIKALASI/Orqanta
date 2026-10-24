import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AppShell } from "@/components/app-shell";
import { AlertTriangle } from "lucide-react";
import type { SubscriptionStatus, FailedPaymentInfo, OrganizationBillingData } from "@/lib/types";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch profile and organization details
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organization:organizations(*)")
    .eq("id", user.id)
    .single();

  const rawOrg = profile?.organization;
  const org = (Array.isArray(rawOrg) ? rawOrg[0] : rawOrg) as Record<string, any> | undefined;
  const orgName = org?.name;
  const userName = profile?.full_name;
  const userEmail = profile?.email || user.email;

  // Resolve trial expiration and subscription status
  let subscriptionStatus = (org?.subscription_status ||
    (org?.feature_flags as Record<string, unknown>)?.subscription_status ||
    "trialing") as SubscriptionStatus;

  // Safe fallback: 7 days from now if not explicitly provided
  const fallbackTrialEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const rawTrialEnd = (org?.trial_ends_at ||
    (org?.feature_flags as Record<string, unknown>)?.trial_ends_at ||
    fallbackTrialEnd) as string;

  const trialEndDate = new Date(rawTrialEnd);
  const now = new Date();
  const isTrialOver = now.getTime() > trialEndDate.getTime();

  // If trial is over and status is NOT 'active', mark as locked
  if (isTrialOver && subscriptionStatus !== "active") {
    if (subscriptionStatus !== "locked" && org?.id) {
      const admin = createAdminClient();
      const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
      const updatedFlags = {
        ...currentFlags,
        subscription_status: "locked",
        trial_ends_at: rawTrialEnd,
      };

      admin
        .from("organizations")
        .update({
          subscription_status: "locked",
          feature_flags: updatedFlags,
        })
        .eq("id", org.id)
        .then(() => {});
    }
    subscriptionStatus = "locked";
  }

  const headersList = headers();
  const currentPath = headersList.get("x-pathname") || "";
  const isBillingPage = currentPath.startsWith("/billing");

  // If the org is 'locked', redirect all app routes to /billing
  if (subscriptionStatus === "locked" && !isBillingPage) {
    redirect("/billing");
  }

  const msRemaining = trialEndDate.getTime() - now.getTime();
  const daysRemaining = Math.min(7, Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24))));
  const isDemoMode = Boolean((org?.feature_flags as Record<string, unknown>)?.demo_mode);

  // Check for prominent failed payment alert
  const orgFlags = (org?.feature_flags as Record<string, unknown>) || {};
  const billingData = orgFlags.billing as OrganizationBillingData | undefined;
  const failedPayment = billingData?.failed_payment as FailedPaymentInfo | undefined;
  const isPaymentFailed = Boolean(failedPayment?.is_failed);

  const graceDate = failedPayment?.grace_period_ends_at
    ? new Date(failedPayment.grace_period_ends_at)
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  const graceDaysLeft = Math.max(0, Math.ceil((graceDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <AppShell
      userEmail={userEmail}
      userName={userName}
      orgName={orgName}
      isDemoMode={isDemoMode}
    >
      {/* Failed Payment Urgent Banner — Surfaces prominently across all pages */}
      {isPaymentFailed && !isBillingPage && (
        <div className="mb-6 p-3 px-4 rounded-xl border border-red-500/40 bg-red-500/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-2.5 text-red-950 font-medium">
            <span className="p-1 rounded bg-red-600 text-white shrink-0">
              <AlertTriangle className="size-3.5" />
            </span>
            <span>
              <strong className="font-bold text-red-900">Payment Failed:</strong> A renewal payment of ₹{failedPayment?.amount || 1999} could not be processed. Update your payment method within {graceDaysLeft} days to avoid workspace suspension.
            </span>
          </div>
          <Link
            href="/billing"
            className="text-xs font-bold px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-all shadow-xs shrink-0"
          >
            Resolve Payment
          </Link>
        </div>
      )}

      {/* 7-Day Trial Top Indicator Banner — Sleek & Non-Intrusive */}
      {!isPaymentFailed && subscriptionStatus === "trialing" && !isBillingPage && (
        <div className="mb-6 p-2.5 px-4 rounded-xl border border-amber-500/25 bg-amber-500/10 flex items-center justify-between text-xs backdrop-blur-sm shadow-xs">
          <div className="flex items-center gap-2.5 text-amber-900 font-medium">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>
              7-Day Free Trial: <strong className="font-semibold text-amber-950">{daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining</strong>
            </span>
          </div>
          <Link
            href="/billing"
            className="text-xs font-semibold px-3 py-1 rounded-lg bg-[#073b3a] hover:bg-[#0a504d] text-white transition-all shadow-sm"
          >
            Upgrade Plan
          </Link>
        </div>
      )}
      {children}
    </AppShell>
  );
}
