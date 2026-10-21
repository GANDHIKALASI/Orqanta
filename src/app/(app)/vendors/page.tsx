import { createClient } from "@/lib/supabase/server";
import { Users, Phone, Mail, DollarSign, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Vendor Directory
          </h1>
          <p className="text-sm text-zinc-500">
            Contractors, trades, hourly rates, and liability insurance compliance.
          </p>
        </div>

        <CreateVendorDialog />
      </div>

      {/* Vendors Grid */}
      {!vendors || vendors.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center py-16">
          <CardContent className="space-y-4 max-w-sm mx-auto">
            <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
              <Users className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                No vendors registered yet
              </h3>
              <p className="text-xs text-zinc-500">
                Add local plumbers, HVAC techs, and handymen so AI can auto-match work orders.
              </p>
            </div>
            <CreateVendorDialog triggerText="Add Your First Vendor" />
          </CardContent>
        </Card>
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
                  className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400",
                  icon: ShieldAlert,
                };
              } else if (daysLeft <= 30) {
                insuranceStatus = {
                  label: `Expires in ${daysLeft}d`,
                  className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400",
                  icon: ShieldAlert,
                };
              } else {
                insuranceStatus = {
                  label: `Insured until ${formatDate(vendor.insurance_expiry)}`,
                  className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400",
                  icon: ShieldCheck,
                };
              }
            }

            return (
              <Card
                key={vendor.id}
                className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                        {vendor.name}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 font-mono text-[11px] capitalize">
                        {vendor.trade.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 text-xs border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Mail className="size-3 text-zinc-400" />
                      Email
                    </span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                      {vendor.email}
                    </span>
                  </div>

                  {vendor.phone && (
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <Phone className="size-3 text-zinc-400" />
                        Phone
                      </span>
                      <span className="text-zinc-800 dark:text-zinc-200">{vendor.phone}</span>
                    </div>
                  )}

                  {vendor.rate_notes && (
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="size-3 text-zinc-400" />
                        Rates
                      </span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate max-w-[150px]">
                        {vendor.rate_notes}
                      </span>
                    </div>
                  )}

                  {insuranceStatus && (
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                      <Badge
                        variant="outline"
                        className={`text-[10px] w-full justify-center gap-1 py-0.5 ${insuranceStatus.className}`}
                      >
                        <insuranceStatus.icon className="size-3" />
                        <span>{insuranceStatus.label}</span>
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
