import { createClient } from "@/lib/supabase/server";
import { Sparkles, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiKeyCard } from "./api-key-card";

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

  const org = profile?.organization;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#073b3a]">
          Workspace Settings
        </h1>
        <p className="text-sm text-slate-500">
          Organization credentials, public SDK embed key, and feature flags.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
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
