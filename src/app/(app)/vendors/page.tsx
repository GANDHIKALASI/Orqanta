import { createClient } from "@/lib/supabase/server";
import { Users, Phone, Mail, DollarSign, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreateVendorDialog } from "./create-dialog";
import { formatDate } from "@/lib/utils";

export default async function VendorsPage() {
  const supabase = createClient();
  const { data: vendors } = await supabase
    .from("vendors")
    .select("*")
    .order("name", { ascending: true });

  const now = new Date();

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#073b3a]">
            Vendor Directory
          </h1>
          <p className="text-sm text-slate-500">
            Contractors, trades, hourly rates, and liability insurance compliance.
          </p>
        </div>

        <CreateVendorDialog />
      </div>

      {/* Vendors Grid */}
      {!vendors || vendors.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#dfe8e3] bg-white text-center py-16 shadow-sm">
          <div className="size-12 rounded-full bg-[#f2f8f6] text-[#073b3a] flex items-center justify-center mx-auto mb-3">
            <Users className="size-6 text-emerald-700" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto mb-5">
            <h3 className="font-semibold text-[#073b3a] text-base">
              No vendors registered yet
            </h3>
            <p className="text-xs text-slate-500">
              Add local plumbers, HVAC techs, and handymen so AI can auto-match work orders.
            </p>
          </div>
          <CreateVendorDialog triggerText="Add Your First Vendor" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => {
            let insuranceStatus = null;
            if (vendor.insurance_expiry) {
              const expiry = new Date(vendor.insurance_expiry);
              const daysLeft = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

              if (daysLeft < 0) {
                insuranceStatus = {
                  label: "Insurance Expired",
                  className: "bg-red-50 text-red-700 border-red-200",
                  icon: ShieldAlert,
                };
              } else if (daysLeft <= 30) {
                insuranceStatus = {
                  label: `Expires in ${daysLeft}d`,
                  className: "bg-amber-50 text-amber-700 border-amber-200",
                  icon: ShieldAlert,
                };
              } else {
                insuranceStatus = {
                  label: `Insured until ${formatDate(vendor.insurance_expiry)}`,
                  className: "bg-emerald-50 text-emerald-700 border-emerald-200",
                  icon: ShieldCheck,
                };
              }
            }

            return (
              <div
                key={vendor.id}
                className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm hover:border-emerald-600/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-base font-semibold text-[#073b3a]">
                        {vendor.name}
                      </h3>
                      <Badge variant="outline" className="mt-1 font-mono text-[11px] capitalize bg-[#f2f8f6] text-[#073b3a] border-emerald-200/80">
                        {vendor.trade.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-3 space-y-2 text-xs border-t border-[#dfe8e3]/60 bg-[#fbfcfa]/60 rounded-b-xl">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Mail className="size-3 text-emerald-700" />
                      Email
                    </span>
                    <span className="font-mono text-[#073b3a] truncate max-w-[150px]">
                      {vendor.email}
                    </span>
                  </div>

                  {vendor.phone && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Phone className="size-3 text-emerald-700" />
                        Phone
                      </span>
                      <span className="text-[#073b3a] font-medium">{vendor.phone}</span>
                    </div>
                  )}

                  {vendor.rate_notes && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <DollarSign className="size-3 text-emerald-700" />
                        Rates
                      </span>
                      <span className="font-medium text-[#073b3a] truncate max-w-[150px]">
                        {vendor.rate_notes}
                      </span>
                    </div>
                  )}

                  {insuranceStatus && (
                    <div className="pt-2 border-t border-[#dfe8e3]/60">
                      <Badge
                        variant="outline"
                        className={`text-[10px] w-full justify-center gap-1 py-0.5 ${insuranceStatus.className}`}
                      >
                        <insuranceStatus.icon className="size-3" />
                        <span>{insuranceStatus.label}</span>
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
