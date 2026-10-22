import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Wrench, Plus, ArrowUpRight, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { formatDate } from "@/lib/utils";

export default async function WorkOrdersPage() {
  const supabase = createClient();
  const { data: workOrders } = await supabase
    .from("work_orders")
    .select("*, property:properties(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#073b3a]">
            Maintenance Work Orders
          </h1>
          <p className="text-sm text-slate-500">
            Track, prioritize, and dispatch service requests across all managed units.
          </p>
        </div>

        <Link href="/work-orders/new">
          <Button size="sm" className="bg-[#073b3a] hover:bg-[#0b4847] text-white font-medium gap-1.5 shadow-sm text-xs h-9">
            <Plus className="size-4" />
            <span>New Work Order</span>
          </Button>
        </Link>
      </div>

      {/* Orders List / Table */}
      {!workOrders || workOrders.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#dfe8e3] bg-white p-16 text-center shadow-sm">
          <div className="size-12 rounded-full bg-[#f2f8f6] text-[#073b3a] flex items-center justify-center mx-auto mb-3">
            <Wrench className="size-5 text-emerald-700" />
          </div>
          <h3 className="font-semibold text-[#073b3a] text-base">
            No work orders recorded
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
            Create a ticket manually or share the tenant portal link to begin logging requests.
          </p>
          <Link href="/work-orders/new">
            <Button size="sm" className="bg-[#073b3a] hover:bg-[#0b4847] text-white font-medium">
              Create First Work Order
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {workOrders.map((order) => (
            <Link
              key={order.id}
              href={`/work-orders/${order.id}`}
              className="block group"
            >
              <div className="rounded-xl border border-[#dfe8e3] bg-white p-4 md:p-5 shadow-sm hover:border-emerald-600/40 hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={order.priority} />
                      <StatusBadge status={order.status} />
                      {order.ai_category && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 bg-[#f2f8f6] px-2 py-0.5 rounded border border-emerald-200/80">
                          <Sparkles className="size-3 text-emerald-600" />
                          <span className="capitalize">{order.ai_category.replace("_", " ")}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-[#073b3a] text-base group-hover:text-emerald-700 transition-colors">
                      {order.title}
                    </h3>

                    {order.ai_summary ? (
                      <p className="text-xs text-slate-500 line-clamp-1 italic">
                        &ldquo;{order.ai_summary}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 line-clamp-1">
                        {order.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#dfe8e3]/60 text-xs text-slate-500">
                    <div className="text-left md:text-right">
                      <p className="font-medium text-[#073b3a] flex items-center md:justify-end gap-1">
                        <Building2 className="size-3 text-emerald-700" />
                        <span>{(order.property as any)?.name || "Building"}</span>
                        {order.unit_number && <span>• Unit {order.unit_number}</span>}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono">{formatDate(order.created_at)}</p>
                    </div>

                    <ArrowUpRight className="size-4 text-slate-400 group-hover:text-[#073b3a] transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
