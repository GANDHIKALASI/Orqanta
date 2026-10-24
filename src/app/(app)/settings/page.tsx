import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Sparkles, Building2, CreditCard, ArrowRight, ShieldCheck, Mail, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ApiKeyCard } from "./api-key-card";
import type { OrganizationBillingData } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organization:organizations(*)")
    .eq("id", user?.id)
    .single();

  const rawOrg = profile?.organization;
  const org = (Array.isArray(rawOrg) ? rawOrg[0] : rawOrg) as Record<string, any> | undefined;
  const flags = (org?.feature_flags as Record<string, unknown>) || {};
  const billing = (flags?.billing as OrganizationBillingData) || {};
  const primaryCard = billing.payment_methods?.[0];
  const billingEmail = billing.billing_details?.contact_email || profile?.email || user?.email;
  const vatNumber = billing.billing_details?.vat_number;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#073b3a]">
          Workspace Settings
        </h1>
        <p className="text-sm text-slate-500">
          Organization credentials, subscription billing, and AI feature flags.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Subscription & Billing Quick Summary */}
        <div className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
          <div className="p-4 px-5 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60 flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-base font-semibold text-[#073b3a] flex items-center gap-2">
                <CreditCard className="size-4 text-emerald-700" />
                Subscription & Billing Details
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Active plan, payment method on file, and billing contact</p>
            </div>
            <Link href="/billing">
              <Button size="sm" variant="outline" className="h-8 text-xs font-semibold gap-1.5 border-slate-300 hover:bg-[#eef5f1] text-[#073b3a]">
                Manage Billing & Invoices
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-[#dfe8e3]/60">
              <span className="text-slate-500">Subscription Status:</span>
              <span className="font-semibold text-emerald-800 capitalize">
                {org?.subscription_status || "Active"} Plan ({billing.plan_name || billing.planName || "Annual Pro"})
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#dfe8e3]/60">
              <span className="text-slate-500">Payment Method on File:</span>
              <span className="font-mono text-slate-700">
                {primaryCard ? `${primaryCard.brand.toUpperCase()} ending in ${primaryCard.last4} (exp ${primaryCard.exp_month}/${primaryCard.exp_year})` : "Visa ending in 4242"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#dfe8e3]/60">
              <span className="text-slate-500">Billing Contact Email:</span>
              <span className="font-medium text-[#073b3a]">{billingEmail}</span>
            </div>
            {vatNumber && (
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">VAT / Tax ID:</span>
                <span className="font-mono text-slate-700 font-medium">{vatNumber}</span>
              </div>
            )}
          </div>
        </div>

        {/* Organization Info */}
        <div className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
          <div className="p-4 px-5 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60">
            <h2 className="text-base font-semibold text-[#073b3a] flex items-center gap-2">
              <Building2 className="size-4 text-emerald-700" />
              Organization Profile
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Primary account identifiers and membership</p>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between py-1.5 border-b border-[#dfe8e3]/60">
              <span className="text-slate-500">Organization Name:</span>
              <span className="font-semibold text-[#073b3a]">{org?.name}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-[#dfe8e3]/60">
              <span className="text-slate-500">Workspace Slug:</span>
              <span className="font-mono text-slate-700">{org?.slug}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Manager:</span>
              <span className="font-medium text-[#073b3a]">{profile?.full_name}</span>
            </div>
          </div>
        </div>

        {/* Public SDK API Key Card */}
        <ApiKeyCard apiKey={org?.api_key || ""} />

        {/* AI Capabilities & Feature Flags */}
        <div className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
          <div className="p-4 px-5 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60">
            <h2 className="text-base font-semibold text-[#073b3a] flex items-center gap-2">
              <Sparkles className="size-4 text-emerald-700" />
              AI Intelligence Capabilities
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by Orqanta AI (Non-blocking async pipelines)
            </p>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-[#dfe8e3]/60">
              <div>
                <p className="font-medium text-[#073b3a]">Smart Ticket Triage</p>
                <p className="text-xs text-slate-500">
                  Auto-categorize trades, assign priority, and generate executive summaries.
                </p>
              </div>
              <Badge variant="outline" className="bg-[#f2f8f6] text-emerald-800 border-emerald-200">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-[#dfe8e3]/60">
              <div>
                <p className="font-medium text-[#073b3a]">Contractor Matching</p>
                <p className="text-xs text-slate-500">
                  Analyze repair context against registered vendors, trade skills, and rates.
                </p>
              </div>
              <Badge variant="outline" className="bg-[#f2f8f6] text-emerald-800 border-emerald-200">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-[#073b3a]">Duplicate Request Warning</p>
                <p className="text-xs text-slate-500">
                  Fuzzy database trigram matching + AI check for identical building complaints.
                </p>
              </div>
              <Badge variant="outline" className="bg-[#f2f8f6] text-emerald-800 border-emerald-200">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
