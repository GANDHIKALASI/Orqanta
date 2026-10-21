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
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Workspace Settings
        </h1>
        <p className="text-sm text-zinc-500">
          Organization credentials, public SDK embed key, and feature flags.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Organization Info */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Building2 className="size-4 text-zinc-500" />
              Organization Profile
            </CardTitle>
            <CardDescription>Primary account identifiers and membership</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Organization Name:</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{org?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Workspace Slug:</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300">{org?.slug}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Manager:</span>
              <span className="font-medium text-zinc-900 dark:text-zinc-100">{profile?.full_name}</span>
            </div>
          </CardContent>
        </Card>

        {/* Public SDK API Key Card */}
        <ApiKeyCard apiKey={org?.api_key || ""} />

        {/* AI Capabilities & Feature Flags */}
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Sparkles className="size-4 text-violet-600 dark:text-violet-400" />
              AI Intelligence Capabilities
            </CardTitle>
            <CardDescription>
              Powered by Orqanta AI (Non-blocking async pipelines)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Smart Ticket Triage</p>
                <p className="text-xs text-zinc-500">
                  Auto-categorize trades, assign priority, and generate executive summaries.
                </p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Contractor Matching</p>
                <p className="text-xs text-zinc-500">
                  Analyze repair context against registered vendors, trade skills, and rates.
                </p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-zinc-900 dark:text-zinc-100">Duplicate Request Warning</p>
                <p className="text-xs text-zinc-500">
                  Fuzzy database trigram matching + AI check for identical building complaints.
                </p>
              </div>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
