import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PayNowButton, TestLockButton } from "./billing-buttons";
import {
  Check,
  Sparkles,
  ShieldAlert,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  Lock,
  Flame,
} from "lucide-react";
import type { SubscriptionStatus } from "@/lib/types";

export const metadata = {
  title: "Billing & Plans — Orqanta",
  description: "Manage your Orqanta property management subscription plan.",
};

export default async function BillingPage() {
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

  const org = profile?.organization;

  // Resolve status and trial end time resiliently
  const rawStatus = (org?.subscription_status ||
    (org?.feature_flags as Record<string, unknown>)?.subscription_status ||
    "trialing") as SubscriptionStatus;

  const rawTrialEnd = (org?.trial_ends_at ||
    (org?.feature_flags as Record<string, unknown>)?.trial_ends_at ||
    (org?.created_at
      ? new Date(new Date(org.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
      : new Date().toISOString())) as string;

  const trialEndDate = new Date(rawTrialEnd);
  const now = new Date();
  const isTrialExpired = now.getTime() > trialEndDate.getTime();
  const isLocked = rawStatus === "locked" || (isTrialExpired && rawStatus !== "active");
  const isActive = rawStatus === "active";

  const msRemaining = trialEndDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      {/* Status Banner */}
      {isLocked ? (
        <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-red-500/10 p-6 md:p-8 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-red-500/20 text-red-600 dark:text-red-400">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="font-semibold uppercase tracking-wider text-xs">
                    Subscription Locked
                  </Badge>
                  <span className="text-xs text-muted-foreground">7-Day Free Trial Ended</span>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-foreground mt-1">
                  Your 7-Day Free Trial Has Ended
                </h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                  Your property workspace is locked. Choose a plan below to immediately restore full access
                  to automated AI work order triage, tenant ticketing, and vendor dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : isActive ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold">
                    Active Plan
                  </Badge>
                  <span className="text-xs text-muted-foreground">Unlimited Access</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mt-0.5">
                  Your Orqanta Organization is Fully Active
                </h3>
              </div>
            </div>
            <TestLockButton />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-semibold">
                    7-Day Free Trial
                  </Badge>
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                    {daysRemaining} {daysRemaining === 1 ? "day" : "days"} remaining
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mt-0.5">
                  You are currently exploring Orqanta on a free 7-day trial
                </h3>
              </div>
            </div>
            <TestLockButton />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          Simple, Transparent Pricing for Modern Portfolios
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
          Scale your maintenance operations, automate repair triage, and keep tenants and vendors aligned.
          No hidden fees.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-4">
        {/* Monthly Plan */}
        <Card className="relative flex flex-col justify-between border-border/80 bg-card hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-sm">
          <CardHeader className="space-y-3 pb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-muted-foreground">
                Monthly Plan
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                  ₹199
                </span>
                <span className="text-sm font-medium text-muted-foreground">/ month</span>
              </div>
              <CardDescription className="text-xs mt-1.5">
                Ideal for independent property managers and landlords looking for effortless automation.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3 text-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                What&apos;s Included:
              </div>
              <ul className="space-y-2.5">
                {[
                  "Orqanta AI Automated Work Order Triage",
                  "Tenant QR Code & Direct Ticketing Portal",
                  "Automated Trade & Vendor Recommendation",
                  "Pre-Drafted Contractor Dispatch Messages",
                  "Real-Time Maintenance Status Tracker",
                  "Unlimited Properties & Units",
                  "Standard Email & Web Support",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border/50">
              <PayNowButton plan="monthly" label="Pay ₹199 / Month" />
              <p className="text-[11px] text-center text-muted-foreground mt-2">
                Billed monthly. Cancel anytime with 1-click.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Annual Plan (Best Value) */}
        <Card className="relative flex flex-col justify-between border-2 border-emerald-500/50 bg-card/90 shadow-xl shadow-emerald-500/5 transition-all">
          <div className="absolute -top-3 right-6">
            <Badge className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-0.5 tracking-wider uppercase shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Best Value • Save 16%
            </Badge>
          </div>

          <CardHeader className="space-y-3 pb-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                Annual Pro
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
                  ₹1,999
                </span>
                <span className="text-sm font-medium text-muted-foreground">/ year</span>
              </div>
              <CardDescription className="text-xs mt-1.5">
                Save ₹389 per year. The complete AI operations engine for growing property portfolios.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 flex-1 flex flex-col justify-between">
            <div className="space-y-3 text-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                Everything in Monthly, Plus:
              </div>
              <ul className="space-y-2.5">
                {[
                  "Orqanta AI Instant Emergency Priority Routing",
                  "Automated Monthly Maintenance Health Summaries",
                  "Duplicate & Chronic Issue Detection",
                  "Unlimited Team Seats & Staff Roles",
                  "Multi-Property Bulk Export & Reporting",
                  "Priority 24/7 Operations Support",
                  "2 Months Free Included (₹1,999/yr vs ₹2,388/yr)",
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-border/50">
              <PayNowButton plan="annual" label="Pay ₹1,999 / Year" isPopular={true} />
              <p className="text-[11px] text-center text-muted-foreground mt-2">
                Annual one-time charge. Full 30-day money-back guarantee.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ / Trust Indicators */}
      <div className="pt-8 border-t border-border/60 max-w-3xl mx-auto">
        <h4 className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">
          Frequently Asked Questions
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
            <p className="font-semibold text-foreground">How does the 7-day trial work?</p>
            <p className="text-muted-foreground">
              You get unrestricted access to all Orqanta features for 7 days upon signup. If you don&apos;t subscribe, your workspace locks safely until you pick a plan.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
            <p className="font-semibold text-foreground">Will I lose my work orders if my trial ends?</p>
            <p className="text-muted-foreground">
              No. Your properties, tenant tickets, and history remain securely stored. They instantly unlock the moment your subscription is activated.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
            <p className="font-semibold text-foreground">Can I cancel anytime?</p>
            <p className="text-muted-foreground">
              Yes, you can pause or cancel anytime with one click directly from your organization settings.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-1">
            <p className="font-semibold text-foreground">Are there limits on units or work orders?</p>
            <p className="text-muted-foreground">
              Both plans include unlimited properties, units, and tenant work order submissions without extra per-door fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
