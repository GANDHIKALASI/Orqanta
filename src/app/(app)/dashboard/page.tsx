import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Wrench,
  AlertTriangle,
  Building2,
  Clock,
  ArrowRight,
  Activity,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { formatDate, formatRelativeTime } from "@/lib/utils";

export default async function DashboardPage() {
  const supabase = createClient();

  // Parallel fetch: Properties, Vendors, Tenants count, Work orders, Activity log
  const [
    propsRes,
    vendorsRes,
    tenantsRes,
    ordersRes,
    activityRes,
  ] = await Promise.all([
    supabase.from("properties").select("id, units"),
    supabase.from("vendors").select("id"),
    supabase.from("profiles").select("id").eq("role", "tenant"),
    supabase
      .from("work_orders")
      .select("*, property:properties(name)")
      .order("created_at", { ascending: false }),
    supabase
      .from("activity_log")
      .select("*, actor:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const properties = propsRes.data || [];
  const vendors = vendorsRes.data || [];
  const tenants = tenantsRes.data || [];
  const allOrders = ordersRes.data || [];
  const activities = activityRes.data || [];

  const totalUnits = properties.reduce((acc, p) => acc + (p.units || 1), 0);
  const openOrders = allOrders.filter((o) => o.status === "open");
  const inProgressOrders = allOrders.filter((o) => o.status === "in_progress");
  const urgentOrders = allOrders.filter((o) => o.priority === "urgent" || o.priority === "high");

  const recentOrders = allOrders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* 3-Step Setup Checklist (Disappears when all complete) */}
      <OnboardingChecklist
        propertyCount={properties.length}
        vendorCount={vendors.length}
        tenantCount={tenants.length}
      />

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Open Requests</span>
            <div className="size-7 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {openOrders.length}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Awaiting contractor triage</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">In Progress</span>
            <div className="size-7 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Wrench className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {inProgressOrders.length}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Dispatched to vendors</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">High / Urgent</span>
            <div className="size-7 rounded-md bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center">
              <AlertTriangle className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {urgentOrders.length}
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
            <span className="text-xs font-medium text-zinc-500">Total Portfolio</span>
            <div className="size-7 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Building2 className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
              {properties.length} <span className="text-sm font-normal text-zinc-400">({totalUnits} units)</span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">{tenants.length} registered tenants</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Recent Tickets & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Work Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
              Recent Maintenance Requests
            </h3>
            <Link
              href="/work-orders"
              className="text-xs font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-800 inline-flex items-center gap-1"
            >
              <span>View all ({allOrders.length})</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <Card className="border-dashed border-2 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm text-center py-12">
              <CardContent className="space-y-3 max-w-sm mx-auto">
                <div className="size-11 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
                  <Wrench className="size-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">No maintenance requests yet</h4>
                  <p className="text-xs text-zinc-500">
                    Submit your first ticket to trigger autonomous Orqanta AI diagnostics and vendor matching.
                  </p>
                </div>
                <Link href="/work-orders/new" className="inline-block pt-1">
                  <Button size="sm" className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium gap-1.5 shadow-sm">
                    <Plus className="size-4" />
                    <span>Create Work Order</span>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((order) => (
                <Link key={order.id} href={`/work-orders/${order.id}`} className="block group">
                  <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all">
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <PriorityBadge priority={order.priority} />
                          <StatusBadge status={order.status} />
                        </div>
                        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">
                          {order.title}
                        </h4>
                        <p className="text-xs text-zinc-400">
                          {(order.property as any)?.name} {order.unit_number && `• Unit ${order.unit_number}`}
                        </p>
                      </div>

                      <div className="text-right shrink-0 text-xs text-zinc-400">
                        {formatDate(order.created_at)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Activity Log */}
        <div className="space-y-4">
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base flex items-center gap-2">
            <Activity className="size-4 text-zinc-500" />
            <span>Activity Timeline</span>
          </h3>

          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardContent className="p-4">
              {activities.length === 0 ? (
                <p className="text-xs text-zinc-400 py-4 text-center">No recent activity.</p>
              ) : (
                <div className="space-y-3.5">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5 text-xs">
                      <div className="size-1.5 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-zinc-800 dark:text-zinc-200">
                          {act.action === "work_order.created" && "Work order created"}
                          {act.action === "ai.triaged" && "Orqanta AI categorized request"}
                          {act.action === "status.changed" && `Status moved to ${act.meta?.new_status}`}
                          {act.action === "vendor.assigned" && "Vendor assigned"}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {formatRelativeTime(act.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
