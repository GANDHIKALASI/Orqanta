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
  Sparkles,
  CheckCircle2,
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
    supabase.from("properties").select("id, name, units"),
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

  const isDemoActive =
    allOrders.some((o) => o.title?.includes("[Demo]")) ||
    properties.some((p) => p.name?.includes("[Demo]"));

  const totalUnits = properties.reduce((acc, p) => acc + (p.units || 1), 0);
  const openOrders = allOrders.filter((o) => o.status === "open");
  const inProgressOrders = allOrders.filter((o) => o.status === "in_progress");
  const urgentOrders = allOrders.filter(
    (o) => o.priority === "urgent" || o.priority === "high"
  );

  const recentOrders = allOrders.slice(0, 6);

  // Dynamic AI Assist Recommendation based on live portfolio state
  let assistHeadline = "All properties operating normally.";
  let assistDetail = "No pending maintenance escalations. Routine inspections are on schedule.";
  let assistActionText = "Create New Work Order";
  let assistActionHref = "/work-orders/new";

  if (urgentOrders.length > 0) {
    assistHeadline = `${urgentOrders.length} urgent ticket${urgentOrders.length > 1 ? "s" : ""} require vendor dispatch.`;
    assistDetail = `Suggested action: review "${urgentOrders[0].title}" and assign a specialized contractor.`;
    assistActionText = "Review Urgent Tickets";
    assistActionHref = `/work-orders/${urgentOrders[0].id}`;
  } else if (openOrders.length > 0) {
    assistHeadline = `${openOrders.length} incoming ticket${openOrders.length > 1 ? "s" : ""} awaiting triage.`;
    assistDetail = "Orqanta AI has categorized descriptions and suggested priority scores.";
    assistActionText = "View Open Queue";
    assistActionHref = "/work-orders";
  }

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Demo Mode Indicator Banner */}
      {isDemoActive && (
        <div className="p-3.5 px-4 rounded-xl border border-emerald-500/30 bg-[#f2f8f6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5 text-[#073b3a] font-medium">
            <Sparkles className="size-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Demo Mode Active:</strong> Sample properties, specialized contractors, and AI work orders are loaded. Click the <strong>Demo Data</strong> toggle in the topbar anytime to return to a clean workspace.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded border border-emerald-200">
            Interactive Test Portfolio
          </span>
        </div>
      )}

      {/* 3-Step Setup Checklist (Disappears when all complete) */}
      <OnboardingChecklist
        propertyCount={properties.length}
        vendorCount={vendors.length}
        tenantCount={tenants.length}
      />

      {/* 4 Core Stat Cards — Styled matching Landing Page DashboardPreview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Requests */}
        <div className="rounded-xl border border-[#dfe8e3] bg-[#f2f8f6] p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Open Requests
            </span>
            <div className="size-7 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#073b3a] tracking-tight">
            {openOrders.length}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <span>Awaiting vendor triage</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="rounded-xl border border-[#dfe8e3] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              In Progress
            </span>
            <div className="size-7 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center">
              <Wrench className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#073b3a] tracking-tight">
            {inProgressOrders.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Dispatched to contractors
          </div>
        </div>

        {/* High / Urgent */}
        <div className="rounded-xl border border-[#dfe8e3] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              High / Urgent
            </span>
            <div className="size-7 rounded-md bg-rose-100 text-rose-800 flex items-center justify-center">
              <AlertTriangle className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#073b3a] tracking-tight">
            {urgentOrders.length}
          </div>
          <div className="mt-1 text-xs text-rose-600 font-medium">
            {urgentOrders.length > 0 ? "Requires manager attention" : "No urgent bottlenecks"}
          </div>
        </div>

        {/* Total Portfolio */}
        <div className="rounded-xl border border-[#dfe8e3] bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Total Portfolio
            </span>
            <div className="size-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Building2 className="size-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-[#073b3a] tracking-tight">
            {properties.length}{" "}
            <span className="text-sm font-normal text-slate-500">
              ({totalUnits} units)
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {tenants.length} registered tenant{tenants.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Tickets & Orqanta Assist / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Work Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#073b3a] text-base">
                Recent Maintenance Requests
              </h3>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                AI triaged
              </span>
            </div>
            <Link
              href="/work-orders"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
            >
              <span>View all ({allOrders.length})</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-xl border-2 border-dashed border-[#dfe8e3] bg-white p-12 text-center shadow-sm">
              <div className="size-12 rounded-full bg-[#f2f8f6] text-[#073b3a] flex items-center justify-center mx-auto mb-3">
                <Wrench className="size-5 text-emerald-700" />
              </div>
              <h4 className="font-semibold text-[#073b3a] text-base">
                No maintenance requests recorded
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                Submit your first ticket to trigger autonomous Orqanta AI diagnostics, duplicate detection, and vendor matching.
              </p>
              <Link href="/work-orders/new">
                <Button className="bg-[#073b3a] hover:bg-[#0b4847] text-white font-medium gap-1.5 shadow-sm text-xs h-9">
                  <Plus className="size-4" />
                  <span>Create Work Order</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/work-orders/${order.id}`}
                  className="block group"
                >
                  <div className="rounded-xl border border-[#dfe8e3] bg-white p-4 shadow-sm hover:border-emerald-600/40 hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <PriorityBadge priority={order.priority} />
                          <StatusBadge status={order.status} />
                          {order.ai_category && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-800 bg-[#f2f8f6] px-2 py-0.5 rounded border border-emerald-200/80">
                              <Sparkles className="size-3 text-emerald-600" />
                              <span className="capitalize">
                                {order.ai_category.replace("_", " ")}
                              </span>
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-[#073b3a] text-sm group-hover:text-emerald-700 transition-colors truncate">
                          {order.title}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {(order.property as any)?.name}{" "}
                          {order.unit_number && `• Unit ${order.unit_number}`}
                        </p>
                      </div>

                      <div className="text-left sm:text-right shrink-0 text-xs text-slate-400 font-mono">
                        {formatDate(order.created_at)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (1 Col): Orqanta Assist Card & Activity Log */}
        <div className="space-y-6">
          {/* Orqanta Assist Recommendation Card (Signature Landing-Style Card) */}
          <div className="rounded-xl bg-[#073b3a] p-5 text-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Sparkles className="size-4 text-emerald-300" />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
                    Orqanta Assist
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-100/70 bg-white/10 px-2 py-0.5 rounded">
                  Live Intelligence
                </span>
              </div>
              <h4 className="mt-3 text-sm font-semibold leading-5 text-white">
                {assistHeadline}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-emerald-100/80">
                {assistDetail}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href={assistActionHref}
                className="text-xs font-semibold text-emerald-300 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <span>{assistActionText}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>

          {/* Activity Log */}
          <div className="space-y-3">
            <h3 className="font-semibold text-[#073b3a] text-base flex items-center gap-2">
              <Activity className="size-4 text-emerald-700" />
              <span>Activity Timeline</span>
            </h3>

            <div className="rounded-xl border border-[#dfe8e3] bg-white p-4 shadow-sm">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No recent activity recorded.
                </p>
              ) : (
                <div className="space-y-3.5">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5 text-xs">
                      <div className="size-2 rounded-full bg-emerald-600 mt-1 shrink-0" />
                      <div className="space-y-0.5">
                        <p className="text-[#073b3a] font-medium">
                          {act.action === "work_order.created" && "Work order created"}
                          {act.action === "ai.triaged" && "Orqanta AI triaged request"}
                          {act.action === "status.changed" && `Status moved to ${act.meta?.new_status}`}
                          {act.action === "vendor.assigned" && "Contractor assigned"}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {formatRelativeTime(act.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
