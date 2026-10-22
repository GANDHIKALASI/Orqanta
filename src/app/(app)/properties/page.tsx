import { createClient } from "@/lib/supabase/server";
import { Building2, MapPin, Mail, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreatePropertyDialog } from "./create-dialog";

export default async function PropertiesPage() {
  const supabase = createClient();
  const { data: properties } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#073b3a]">
            Property Portfolio
          </h1>
          <p className="text-sm text-slate-500">
            Manage your buildings, total unit counts, and property owner details.
          </p>
        </div>

        <CreatePropertyDialog />
      </div>

      {/* Property Cards Grid */}
      {!properties || properties.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#dfe8e3] bg-white text-center py-16 shadow-sm">
          <div className="size-12 rounded-full bg-[#f2f8f6] text-[#073b3a] flex items-center justify-center mx-auto mb-3">
            <Building2 className="size-6 text-emerald-700" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto mb-5">
            <h3 className="font-semibold text-[#073b3a] text-base">
              No properties added yet
            </h3>
            <p className="text-xs text-slate-500">
              Register your first building or multi-unit property to begin assigning units and work orders.
            </p>
          </div>
          <CreatePropertyDialog triggerText="Add Your First Property" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm hover:border-emerald-600/40 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-[#073b3a]">
                      {property.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="size-3 text-emerald-700 shrink-0" />
                      <span>{property.address}</span>
                    </p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs shrink-0 bg-[#f2f8f6] text-[#073b3a] border-emerald-200/80">
                    {property.units} {property.units === 1 ? "unit" : "units"}
                  </Badge>
                </div>
              </div>

              <div className="p-5 pt-3 text-xs space-y-2 border-t border-[#dfe8e3]/60 bg-[#fbfcfa]/60 rounded-b-xl">
                {property.owner_name && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <User className="size-3" />
                      Owner
                    </span>
                    <span className="font-medium text-[#073b3a]">
                      {property.owner_name}
                    </span>
                  </div>
                )}
                {property.owner_email && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="size-3" />
                      Owner Email
                    </span>
                    <span className="truncate max-w-[150px] font-mono text-[11px] text-slate-600">
                      {property.owner_email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
