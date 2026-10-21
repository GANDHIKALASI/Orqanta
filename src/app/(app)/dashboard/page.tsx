import Image from "next/image";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, Sparkles, Building2, User } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch the manager's profile and organization
  const { data: profile } = await supabase
    .from("profiles")
    .select("*, organization:organizations(*)")
    .eq("id", user.id)
    .single();

  const organization = profile?.organization;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-3">
              <Image
                src="/logo-icon.png"
                alt="Orqanta"
                width={36}
                height={36}
                className="size-8 object-contain rounded-md"
              />
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Orqanta Workspace
              </h1>
            </div>
            <p className="text-sm text-zinc-500">
              AI-native maintenance desk & vendor management
            </p>
          </div>

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </form>
        </div>

        {/* Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Building2 className="size-4 text-zinc-500" />
                  Organization Details
                </CardTitle>
                <Badge variant="secondary" className="font-mono text-xs">
                  {profile?.role || "manager"}
                </Badge>
              </div>
              <CardDescription>Multi-tenant organization profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">Name:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {organization?.name || "Initializing..."}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">Slug:</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">
                  {organization?.slug || "—"}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Public SDK API Key:</span>
                <span className="font-mono text-xs text-zinc-600 dark:text-zinc-400 truncate max-w-[200px]">
                  {organization?.api_key || "—"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="size-4 text-zinc-500" />
                Active Session
              </CardTitle>
              <CardDescription>Authenticated user credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">Manager:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {profile?.full_name || user.email}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-zinc-500">Email:</span>
                <span className="text-zinc-700 dark:text-zinc-300">{user.email}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Tenant Isolation (RLS):</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-xs">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Banner */}
        <Card className="border-violet-200 dark:border-violet-900/50 bg-violet-50/60 dark:bg-violet-950/20">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="size-10 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 flex items-center justify-center shrink-0">
              <Sparkles className="size-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                Authentication & Onboarding Ready!
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Your manager account and organization data are securely scoped with PostgreSQL Row Level Security.
                You can now proceed to manage properties, vendors, and AI-triaged work orders.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
