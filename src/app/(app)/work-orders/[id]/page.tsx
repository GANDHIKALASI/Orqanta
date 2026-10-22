import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Sparkles,
  Users,
  Activity,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import { StatusUpdater } from "./status-updater";
import { VendorAssigner } from "./vendor-assigner";

interface WorkOrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function WorkOrderDetailPage({ params }: WorkOrderDetailPageProps) {
  const supabase = createClient();

  // Fetch work order, joined property, vendor, tenant, and activity log
  const [woRes, vendorsRes, activityRes] = await Promise.all([
    supabase
      .from("work_orders")
      .select("*, property:properties(*), vendor:vendors(*), tenant:profiles(*)")
      .eq("id", params.id)
      .single(),
    supabase.from("vendors").select("*").order("name", { ascending: true }),
    supabase
      .from("activity_log")
      .select("*, actor:profiles(full_name, role)")
      .eq("work_order_id", params.id)
      .order("created_at", { ascending: false }),
  ]);

  const order = woRes.data;
  if (!order) {
    notFound();
  }

  const vendors = vendorsRes.data || [];
  const activities = activityRes.data || [];

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Top Back & Header */}
      <div className="space-y-3">
        <Link
          href="/work-orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#073b3a] transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Work Orders</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={order.priority} />
              <StatusBadge status={order.status} />
              <span className="text-xs text-slate-400 font-mono">#{order.id.substring(0, 8)}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#073b3a]">
              {order.title}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Building2 className="size-3 text-emerald-700" />
                <span>{(order.property as any)?.name}</span>
                {order.unit_number && <span>• Unit {order.unit_number}</span>}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-emerald-700" />
                <span>Created {formatDate(order.created_at)}</span>
              </span>
            </p>
          </div>

          <StatusUpdater workOrderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Details + AI Insight */}
        <div className="lg:col-span-2 space-y-6">
          {/* AI Insight Card */}
          {order.ai_summary && (
            <div className="rounded-xl border border-emerald-200/80 bg-[#f2f8f6] p-5 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                  <Sparkles className="size-4 text-emerald-600" />
                  <span>Orqanta AI Triage Assessment</span>
                </div>
                {order.ai_category && (
                  <Badge variant="outline" className="capitalize text-xs font-medium bg-white text-[#073b3a] border-emerald-200">
                    {order.ai_category.replace("_", " ")}
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-[#073b3a] leading-relaxed pt-1">
                {order.ai_summary}
              </p>
            </div>
          )}

          {/* Description & Details */}
          <div className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
            <div className="p-4 px-5 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60">
              <h2 className="text-base font-semibold text-[#073b3a]">Reported Issue Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {order.description}
              </p>
            </div>
          </div>

          {/* Activity Audit Timeline */}
          <div className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
            <div className="p-4 px-5 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60">
              <h2 className="text-base font-semibold text-[#073b3a] flex items-center gap-2">
                <Activity className="size-4 text-emerald-700" />
                <span>Audit & Activity History</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Immutable record of status updates and assignments</p>
            </div>
            <div className="p-5">
              {activities.length === 0 ? (
                <p className="text-xs text-slate-400 py-2">No activity recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 text-xs">
                      <div className="size-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <div className="flex-1 space-y-0.5">
                        <p className="font-medium text-[#073b3a]">
                          {act.action === "work_order.created" && "Work order submitted"}
                          {act.action === "ai.triaged" && "AI triage completed by Orqanta AI"}
                          {act.action === "status.changed" && `Status changed to ${act.meta?.new_status}`}
                          {act.action === "vendor.assigned" && "Vendor assigned to job"}
                          {act.action === "vendor.unassigned" && "Vendor assignment removed"}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {act.actor?.full_name ? `${act.actor.full_name} • ` : ""}
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

        {/* Right Column: Vendor Assignment & Meta */}
        <div className="space-y-6">
          <VendorAssigner
            workOrderId={order.id}
            assignedVendorId={order.vendor_id}
            vendors={vendors}
          />

          {/* Property Context Card */}
          <div className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
            <div className="p-4 px-5 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60">
              <h3 className="text-sm font-semibold text-[#073b3a] flex items-center gap-2">
                <Building2 className="size-4 text-emerald-700" />
                Property & Location
              </h3>
            </div>
            <div className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Building:</span>
                <span className="font-medium text-[#073b3a]">
                  {(order.property as any)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Address:</span>
                <span className="text-slate-700">
                  {(order.property as any)?.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unit #:</span>
                <span className="font-mono font-medium text-[#073b3a]">
                  {order.unit_number || "Common Area"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
