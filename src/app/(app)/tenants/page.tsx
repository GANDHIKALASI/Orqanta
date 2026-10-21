import { createClient } from "@/lib/supabase/server";
import { KeyRound, Mail, Phone, Building2, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InviteTenantDialog } from "./invite-dialog";
import { formatDate } from "@/lib/utils";

export default async function TenantsPage() {
  const supabase = createClient();

  const [tenantsRes, propertiesRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*, property:properties(name)")
      .eq("role", "tenant")
      .order("created_at", { ascending: false }),
    supabase.from("properties").select("*").order("name", { ascending: true }),
  ]);

  const tenants = tenantsRes.data || [];
  const properties = propertiesRes.data || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Tenant Roster
          </h1>
          <p className="text-sm text-zinc-500">
            Residents with unit-scoped access to report and track maintenance issues.
          </p>
        </div>

        <InviteTenantDialog properties={properties} />
      </div>

      {/* Tenants Grid */}
      {tenants.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center py-16">
          <CardContent className="space-y-4 max-w-sm mx-auto">
            <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
              <KeyRound className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                No tenants registered yet
              </h3>
              <p className="text-xs text-zinc-500">
                Invite residents to their portal so they can submit photo-backed work orders directly.
              </p>
            </div>
            <InviteTenantDialog properties={properties} triggerText="Invite Your First Tenant" />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <Card
              key={tenant.id}
              className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                      {tenant.full_name}
                    </CardTitle>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="size-3 text-zinc-400" />
                      <span>{(tenant.property as any)?.name || "Unassigned"}</span>
                    </p>
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    Unit {tenant.unit_number || "—"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="size-3 text-zinc-400" />
                    Email
                  </span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                    {tenant.email}
                  </span>
                </div>

                {tenant.phone && (
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Phone className="size-3 text-zinc-400" />
                      Phone
                    </span>
                    <span className="text-zinc-800 dark:text-zinc-200">{tenant.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-zinc-500 text-[11px] pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                  <span>Joined</span>
                  <span>{formatDate(tenant.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
