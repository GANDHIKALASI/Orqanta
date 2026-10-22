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
  Users,
  KeyRound,
  ArrowUpRight,
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { OnboardingChecklist } from "@/components/onboarding-checklist";
import { DashboardTickets } from "./dashboard-tickets";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { DemoDataToggle } from "@/components/demo-data-toggle";

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
    supabase.from("vendors").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "tenant"),
    supabase
      .from("work_orders")
      .select("*, property:properties(name)")
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("activity_log")
      .select("*, actor:profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const properties = propsRes.data || [];
  const vendorCount = vendorsRes.count ?? (vendorsRes.data?.length || 0);
  const tenantCount = tenantsRes.count ?? (tenantsRes.data?.length || 0);
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

  // Dynamic AI Assist Recommendation based on live portfolio state
  let assistHeadline = "All properties operating normally.";
  let assistDetail = "No pending maintenance escalations. Routine inspections and vendor schedules are on track.";
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
    assistActionHref = "/work-orders?status=open";
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* 3-Step Setup Checklist (Disappears when all complete) */}
      <OnboardingChecklist
        propertyCount={properties.length}
        vendorCount={vendorCount}
        tenantCount={tenantCount}
      />

      {/* 4 Core Executive Stat Cards — Interactive & Elevated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Open Requests */}
        <Link
          href="/work-orders?status=open"
          className="group relative block rounded-2xl border border-[#dfe8e3] bg-gradient-to-br from-white via-white to-amber-50/40 p-5 shadow-xs hover:border-amber-400/60 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-amber-900 transition-colors">
              Open Requests
            </span>
            <div className="size-8 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <Clock className="size-4 text-amber-700" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#073b3a] tracking-tight">
            {openOrders.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-amber-800 font-medium">
            <span>Awaiting vendor triage</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* In Progress */}
        <Link
          href="/work-orders?status=in_progress"
          className="group relative block rounded-2xl border border-[#dfe8e3] bg-gradient-to-br from-white via-white to-blue-50/40 p-5 shadow-xs hover:border-blue-400/60 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-900 transition-colors">
              In Progress
            </span>
            <div className="size-8 rounded-xl bg-blue-500/10 text-blue-700 border border-blue-500/20 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <Wrench className="size-4 text-blue-700" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#073b3a] tracking-tight">
            {inProgressOrders.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-blue-800 font-medium">
            <span>Dispatched to contractors</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* High / Urgent */}
        <Link
          href="/work-orders?priority=urgent"
          className="group relative block rounded-2xl border border-[#dfe8e3] bg-gradient-to-br from-white via-white to-rose-50/40 p-5 shadow-xs hover:border-rose-400/60 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-rose-900 transition-colors">
              High / Urgent
            </span>
            <div className="size-8 rounded-xl bg-rose-500/10 text-rose-700 border border-rose-500/20 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <AlertTriangle className="size-4 text-rose-700" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#073b3a] tracking-tight">
            {urgentOrders.length}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-rose-700 font-medium">
            <span>{urgentOrders.length > 0 ? "Requires manager attention" : "No urgent bottlenecks"}</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Total Portfolio */}
        <Link
          href="/properties"
          className="group relative block rounded-2xl border border-[#dfe8e3] bg-gradient-to-br from-white via-white to-emerald-50/40 p-5 shadow-xs hover:border-emerald-600/60 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between pb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-emerald-900 transition-colors">
              Total Portfolio
            </span>
            <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-800 border border-emerald-500/20 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs">
              <Building2 className="size-4 text-emerald-800" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-[#073b3a] tracking-tight">
            {properties.length}{" "}
            <span className="text-sm font-medium text-slate-500">
              ({totalUnits} units)
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-emerald-800 font-medium">
            <span>{tenantCount} registered tenant{tenantCount === 1 ? "" : "s"}</span>
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Quick Actions Navigation Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/work-orders/new"
          className="flex items-center gap-3 p-3.5 rounded-xl border border-[#dfe8e3] bg-white hover:bg-[#f2f8f6] hover:border-emerald-600/40 shadow-xs transition-all text-xs font-semibold text-[#073b3a] group hover:-translate-y-0.5"
        >
          <div className="size-8 rounded-lg bg-[#073b3a] text-white flex items-center justify-center shrink-0 group-hover:bg-[#0a504d] shadow-xs">
            <Plus className="size-4" />
          </div>
          <span>New Work Order</span>
        </Link>

        <Link
          href="/properties"
          className="flex items-center gap-3 p-3.5 rounded-xl border border-[#dfe8e3] bg-white hover:bg-[#f2f8f6] hover:border-emerald-600/40 shadow-xs transition-all text-xs font-semibold text-[#073b3a] group hover:-translate-y-0.5"
        >
          <div className="size-8 rounded-lg bg-[#eef5f1] text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 shadow-xs">
            <Building2 className="size-4" />
          </div>
          <span>Manage Buildings</span>
        </Link>

        <Link
          href="/vendors"
          className="flex items-center gap-3 p-3.5 rounded-xl border border-[#dfe8e3] bg-white hover:bg-[#f2f8f6] hover:border-emerald-600/40 shadow-xs transition-all text-xs font-semibold text-[#073b3a] group hover:-translate-y-0.5"
        >
          <div className="size-8 rounded-lg bg-[#eef5f1] text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 shadow-xs">
            <Users className="size-4" />
          </div>
          <span>Contractor Directory</span>
        </Link>

        <Link
          href="/tenants"
          className="flex items-center gap-3 p-3.5 rounded-xl border border-[#dfe8e3] bg-white hover:bg-[#f2f8f6] hover:border-emerald-600/40 shadow-xs transition-all text-xs font-semibold text-[#073b3a] group hover:-translate-y-0.5"
        >
          <div className="size-8 rounded-lg bg-[#eef5f1] text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 shadow-xs">
            <KeyRound className="size-4" />
          </div>
          <span>Tenant Portal</span>
        </Link>
      </div>

      {/* Main Grid: Interactive Recent Tickets List & Orqanta Assist / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Interactive Dashboard Tickets List */}
        <div className="lg:col-span-2">
          <DashboardTickets orders={allOrders} />
        </div>

        {/* Right Column (1 Col): Orqanta Assist Card & Activity Log */}
        <div className="space-y-6">
          {/* Orqanta Assist Recommendation Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#073b3a] to-[#042626] p-5 text-white shadow-md border border-emerald-500/20 overflow-hidden flex flex-col justify-between">
            {/* Ambient subtle glow */}
            <div className="absolute -top-12 -right-12 size-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-md bg-emerald-400/20 flex items-center justify-center">
                    <Sparkles className="size-3.5 text-emerald-300" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Orqanta Assist
                  </span>
                </div>
                <span className="text-[10px] font-mono font-medium text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Copilot
                </span>
              </div>
              <h4 className="mt-3.5 text-sm font-semibold leading-snug text-white">
                {assistHeadline}
              </h4>
              <p className="mt-2 text-xs leading-relaxed text-emerald-100/80">
                {assistDetail}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                href={assistActionHref}
                className="text-xs font-semibold text-emerald-300 hover:text-white inline-flex items-center gap-1.5 transition-colors group"
              >
                <span>{assistActionText}</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Activity Log */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#073b3a] text-base flex items-center gap-2">
                <Activity className="size-4 text-emerald-700" />
                <span>Activity Timeline</span>
              </h3>
              <span className="text-[11px] text-slate-400">Live feed</span>
            </div>

            <div className="rounded-xl border border-[#dfe8e3] bg-white p-4 shadow-sm divide-y divide-[#dfe8e3]/40">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">
                  No recent activity recorded.
                </p>
              ) : (
                activities.map((act) => (
                  <Link
                    key={act.id}
                    href={act.work_order_id ? `/work-orders/${act.work_order_id}` : "/work-orders"}
                    className="flex items-start gap-2.5 py-3 first:pt-1 last:pb-1 group hover:bg-[#fbfcfa] -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
                  >
                    <div className="size-2 rounded-full bg-emerald-600 mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="text-[#073b3a] font-medium text-xs group-hover:text-emerald-700 transition-colors">
                        {act.action === "work_order.created" && "Work order created"}
                        {act.action === "ai.triaged" && "Orqanta AI triaged request"}
                        {act.action === "status.changed" && `Status moved to ${act.meta?.new_status}`}
                        {act.action === "vendor.assigned" && "Contractor assigned"}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {formatRelativeTime(act.created_at)}
                      </p>
                    </div>
                    <ArrowUpRight className="size-3 text-slate-300 group-hover:text-emerald-700 transition-colors shrink-0" />
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
