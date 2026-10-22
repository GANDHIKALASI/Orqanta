import { createClient } from "@/lib/supabase/server";
import { KeyRound, Mail, Phone, Building2 } from "lucide-react";
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
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#073b3a]">
            Tenant Roster
          </h1>
          <p className="text-sm text-slate-500">
            Residents with unit-scoped access to report and track maintenance issues.
          </p>
        </div>

        <InviteTenantDialog properties={properties} />
      </div>

      {/* Tenants Grid */}
      {tenants.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#dfe8e3] bg-white text-center py-16 shadow-sm">
          <div className="size-12 rounded-full bg-[#f2f8f6] text-[#073b3a] flex items-center justify-center mx-auto mb-3">
            <KeyRound className="size-6 text-emerald-700" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto mb-5">
            <h3 className="font-semibold text-[#073b3a] text-base">
              No tenants registered yet
            </h3>
            <p className="text-xs text-slate-500">
              Invite residents to their portal so they can submit photo-backed work orders directly.
            </p>
          </div>
          <InviteTenantDialog properties={properties} triggerText="Invite Your First Tenant" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenants.map((tenant) => (
            <div
              key={tenant.id}
              className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm hover:border-emerald-600/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-[#073b3a]">
                      {tenant.full_name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Building2 className="size-3 text-emerald-700" />
                      <span>{(tenant.property as any)?.name || "Unassigned Building"}</span>
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs bg-[#f2f8f6] text-[#073b3a] border-emerald-200/80">
                    Unit {tenant.unit_number || "—"}
                  </Badge>
                </div>
              </div>

              <div className="p-5 pt-3 space-y-2 text-xs border-t border-[#dfe8e3]/60 bg-[#fbfcfa]/60 rounded-b-xl">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Mail className="size-3 text-emerald-700" />
                    Email
                  </span>
                  <span className="font-mono text-[#073b3a] truncate max-w-[150px]">
                    {tenant.email}
                  </span>
                </div>

                {tenant.phone && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Phone className="size-3 text-emerald-700" />
                      Phone
                    </span>
                    <span className="text-[#073b3a] font-medium">{tenant.phone}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-400 text-[11px] pt-1 border-t border-[#dfe8e3]/60">
                  <span>Joined</span>
                  <span className="font-mono">{formatDate(tenant.created_at)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
