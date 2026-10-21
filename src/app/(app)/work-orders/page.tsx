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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Maintenance Work Orders
          </h1>
          <p className="text-sm text-zinc-500">
            Track, prioritize, and dispatch service requests across all managed units.
          </p>
        </div>

        <Link href="/work-orders/new">
          <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium gap-1.5 shadow-sm">
            <Plus className="size-4" />
            <span>New Work Order</span>
          </Button>
        </Link>
      </div>

      {/* Orders List / Table */}
      {!workOrders || workOrders.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center py-16">
          <CardContent className="space-y-4 max-w-sm mx-auto">
            <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
              <Wrench className="size-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                No work orders recorded
              </h3>
              <p className="text-xs text-zinc-500">
                Create a ticket manually or share the tenant portal link to begin logging requests.
              </p>
            </div>
            <Link href="/work-orders/new">
              <Button size="sm" className="bg-zinc-900 text-white">
                Create First Work Order
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {workOrders.map((order) => (
            <Link
              key={order.id}
              href={`/work-orders/${order.id}`}
              className="block group"
            >
              <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all">
                <CardContent className="p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <PriorityBadge priority={order.priority} />
                      <StatusBadge status={order.status} />
                      {order.ai_category && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-violet-700 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-0.5 rounded border border-violet-200 dark:border-violet-900/50">
                          <Sparkles className="size-3" />
                          <span className="capitalize">{order.ai_category.replace("_", " ")}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {order.title}
                    </h3>

                    {order.ai_summary ? (
                      <p className="text-xs text-zinc-500 line-clamp-1 italic">
                        &ldquo;{order.ai_summary}&rdquo;
                      </p>
                    ) : (
                      <p className="text-xs text-zinc-500 line-clamp-1">
                        {order.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                    <div className="text-left md:text-right">
                      <p className="font-medium text-zinc-800 dark:text-zinc-200 flex items-center md:justify-end gap-1">
                        <Building2 className="size-3" />
                        <span>{(order.property as any)?.name || "Building"}</span>
                        {order.unit_number && <span>• Unit {order.unit_number}</span>}
                      </p>
                      <p className="text-[11px] text-zinc-400">{formatDate(order.created_at)}</p>
                    </div>

                    <ArrowUpRight className="size-4 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
