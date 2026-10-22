import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import type { SubscriptionStatus } from "@/lib/types";

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

  const org = profile?.organization;
  const orgName = org?.name;
  const userName = profile?.full_name;
  const userEmail = profile?.email || user.email;

  // Resolve trial expiration and subscription status
  let subscriptionStatus = (org?.subscription_status ||
    (org?.feature_flags as Record<string, unknown>)?.subscription_status ||
    "trialing") as SubscriptionStatus;

  const rawTrialEnd = (org?.trial_ends_at ||
    (org?.feature_flags as Record<string, unknown>)?.trial_ends_at ||
    (org?.created_at
      ? new Date(new Date(org.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      : new Date().toISOString())) as string;

  const trialEndDate = new Date(rawTrialEnd);
  const now = new Date();
  const isTrialOver = now.getTime() > trialEndDate.getTime();

  // If trial is over and status is NOT 'active', update status to 'locked'
  if (isTrialOver && subscriptionStatus !== "active") {
    if (subscriptionStatus !== "locked" && org?.id) {
      const admin = createAdminClient();
      const currentFlags = (org?.feature_flags as Record<string, unknown>) || {};
      const updatedFlags = {
        ...currentFlags,
        subscription_status: "locked",
        trial_ends_at: rawTrialEnd,
      };

      const { error } = await admin
        .from("organizations")
        .update({
          subscription_status: "locked",
          feature_flags: updatedFlags,
        })
        .eq("id", org.id);

      if (error) {
        await admin
          .from("organizations")
          .update({
            feature_flags: updatedFlags,
          })
          .eq("id", org.id);
      }
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
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const isDemoMode = Boolean((org?.feature_flags as Record<string, unknown>)?.demo_mode);

  return (
    <div className="min-h-screen flex bg-[#fbfcfa] font-sans antialiased text-[#0b292b]">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:flex">
        <Sidebar
          userEmail={userEmail}
          userName={userName}
          orgName={orgName}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          userEmail={userEmail}
          userName={userName}
          orgName={orgName}
          isDemoMode={isDemoMode}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {/* 7-Day Trial Top Indicator Banner */}
            {subscriptionStatus === "trialing" && !isBillingPage && (
              <div className="mb-6 p-3 px-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-between text-xs backdrop-blur-sm">
                <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                  </span>
                  <span>
                    7-Day Free Trial: <strong>{daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining</strong>
                  </span>
                </div>
                <Link
                  href="/billing"
                  className="font-semibold px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-sm"
                >
                  Upgrade Plan
                </Link>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
