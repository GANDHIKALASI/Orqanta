import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getOrganizationBilling } from "./actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PayNowButton } from "./billing-buttons";
import { PaymentMethodCard } from "./components/payment-method-card";
import { SubscriptionOverviewCard } from "./components/subscription-overview-card";
import { InvoicesTable } from "./components/invoices-table";
import { BillingDetailsForm } from "./components/billing-details-form";
import { FailedPaymentBanner } from "./components/failed-payment-banner";
import { BillingFaq } from "./components/billing-faq";
import { BillingTestTools } from "./components/billing-test-tools";
import {
  Check,
  Sparkles,
  Lock,
  Clock,
  CheckCircle2,
  Receipt,
  CreditCard,
  Building2,
  ShieldAlert,
  ArrowRight,
} from "lucide-react";

export const metadata = {
  title: "Billing & Subscription Management — Orqanta",
  description: "Manage your Orqanta property management subscription plan, payment methods, tax details, and invoices.",
};

export default async function BillingPage() {
  const { billing, subscriptionStatus, isTrialExpired, daysRemaining } =
    await getOrganizationBilling();

  const isLocked = subscriptionStatus === "locked" || (isTrialExpired && subscriptionStatus !== "active");
  const isActive = subscriptionStatus === "active";
  const hasFailedPayment = Boolean(billing.failed_payment?.is_failed);

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      {/* 1. Failed Payment Prominent Recovery Alert (if active) */}
      {hasFailedPayment && billing.failed_payment && (
        <FailedPaymentBanner
          failedPayment={billing.failed_payment}
          cardholderName={billing.billing_details.company_name}
        />
      )}

      {/* 2. Subscription Status Banner (Locked, Active, or Trial) */}
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
      ) : isActive && !hasFailedPayment ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-semibold">
                    {billing.plan_name || billing.planName || "Active Plan"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">Unlimited Access Active</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mt-0.5">
                  Your Orqanta Organization is Fully Active
                </h3>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground hidden sm:block">
              Auto-renewing on{" "}
              <strong className="text-foreground">
                {new Date(billing.next_billing_date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </strong>
            </div>
          </div>
        </div>
      ) : !hasFailedPayment ? (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-amber-500/40 text-amber-600 dark:text-amber-400 text-xs font-semibold"
                  >
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
          </div>
        </div>
      ) : null}

      {/* 3. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#073b3a]">
            Billing & Subscription Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage payment methods, upcoming billing dates, tax & VAT legal credentials, and past invoices.
          </p>
        </div>
      </div>

      {/* 4. Tabbed Organization of Billing Management */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-xl h-10 border border-slate-200">
          <TabsTrigger
            value="overview"
            className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#073b3a] data-[state=active]:shadow-xs"
          >
            <CreditCard className="size-3.5" />
            Plan & Payment Methods
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#073b3a] data-[state=active]:shadow-xs"
          >
            <Receipt className="size-3.5" />
            Invoices & Tax Receipts ({billing.invoices.length})
          </TabsTrigger>
          <TabsTrigger
            value="tax-details"
            className="text-xs font-semibold gap-1.5 rounded-lg data-[state=active]:bg-white data-[state=active]:text-[#073b3a] data-[state=active]:shadow-xs"
          >
            <Building2 className="size-3.5" />
            Billing Contact & Tax Info
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview (Next Billing Date, Payment Method on File, Available Plans) */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Next Billing Date and Amount Card */}
            <SubscriptionOverviewCard
              plan={billing.plan}
              planName={billing.plan_name || billing.planName || "Annual Pro Plan"}
              amount={billing.amount}
              currency={billing.currency}
              nextBillingDate={billing.next_billing_date}
              autoRenew={billing.auto_renew}
              subscriptionStatus={subscriptionStatus}
              daysRemaining={daysRemaining}
            />

            {/* Payment Method on File Card */}
            <PaymentMethodCard
              paymentMethods={billing.payment_methods}
              cardholderName={billing.billing_details.company_name}
            />
          </div>

          {/* Change Plan / Upgrade Pricing Cards Grid */}
          <div className="pt-4 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-[#073b3a] tracking-tight">
                Available Subscription Plans
              </h3>
              <p className="text-xs text-slate-500">
                Switch billing cycle or upgrade plan tier anytime. Adjustments are prorated automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Monthly Plan */}
              <Card className="relative flex flex-col justify-between border-border/80 bg-white hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-sm">
                <CardHeader className="space-y-3 pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                      Monthly Plan
                    </span>
                    {billing.plan === "monthly" && isActive && (
                      <Badge variant="outline" className="text-[10px] font-bold border-emerald-300 text-emerald-800 bg-emerald-50">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight text-foreground">
                        ₹199
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">/ month</span>
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
                    <PayNowButton
                      plan="monthly"
                      label={billing.plan === "monthly" && isActive ? "Renew ₹199 / Month" : "Pay ₹199 / Month via Razorpay"}
                      userEmail={billing.billing_details.contact_email}
                      userName={billing.billing_details.company_name}
                      orgName={billing.billing_details.company_name}
                    />
                    <p className="text-[11px] text-center text-muted-foreground mt-2">
                      Instant activation via UPI, Card, or Netbanking. Cancel anytime.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Annual Plan (Best Value) */}
              <Card className="relative flex flex-col justify-between border-2 border-emerald-500/50 bg-white shadow-lg shadow-emerald-500/5 transition-all">
                <div className="absolute -top-3 right-6">
                  <Badge className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] px-3 py-0.5 tracking-wider uppercase shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Best Value • Save 16%
                  </Badge>
                </div>

                <CardHeader className="space-y-3 pb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">
                      Annual Pro
                    </span>
                    {billing.plan === "annual" && isActive && (
                      <Badge variant="outline" className="text-[10px] font-bold border-emerald-300 text-emerald-800 bg-emerald-50">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight text-foreground">
                        ₹1,999
                      </span>
                      <span className="text-xs font-medium text-muted-foreground">/ year</span>
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
                    <PayNowButton
                      plan="annual"
                      label={billing.plan === "annual" && isActive ? "Renew ₹1,999 / Year" : "Pay ₹1,999 / Year via Razorpay"}
                      isPopular={true}
                      userEmail={billing.billing_details.contact_email}
                      userName={billing.billing_details.company_name}
                      orgName={billing.billing_details.company_name}
                    />
                    <p className="text-[11px] text-center text-muted-foreground mt-2">
                      Secured by Razorpay • Instant activation via UPI, Card, Netbanking. Full money-back guarantee.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Invoices and Receipts */}
        <TabsContent value="invoices" className="space-y-6">
          <InvoicesTable
            invoices={billing.invoices}
            billingDetails={billing.billing_details}
          />
        </TabsContent>

        {/* Tab 3: Billing Contact & Tax Info */}
        <TabsContent value="tax-details" className="space-y-6">
          <BillingDetailsForm initialDetails={billing.billing_details} />
        </TabsContent>
      </Tabs>

      {/* 5. Interactive Billing FAQ */}
      <BillingFaq />

      {/* 6. Testing & Simulation Controls for Verification */}
      <BillingTestTools isFailed={hasFailedPayment} />
    </div>
  );
}
