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
import { Button } from "@/components/ui/button";
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
    <div className="space-y-6">
      {/* Top Back & Header */}
      <div className="space-y-3">
        <Link
          href="/work-orders"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Work Orders</span>
        </Link>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <PriorityBadge priority={order.priority} />
              <StatusBadge status={order.status} />
              <span className="text-xs text-zinc-400 font-mono">#{order.id.substring(0, 8)}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {order.title}
            </h1>
            <p className="text-xs text-zinc-500 flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Building2 className="size-3 text-zinc-400" />
                <span>{(order.property as any)?.name}</span>
                {order.unit_number && <span>• Unit {order.unit_number}</span>}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3 text-zinc-400" />
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
            <Card className="border-violet-200 dark:border-violet-900/50 bg-gradient-to-br from-violet-50/80 via-white to-violet-50/20 dark:from-violet-950/20 dark:to-zinc-900 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-violet-700 dark:text-violet-400 font-semibold text-sm">
                    <Sparkles className="size-4" />
                    <span>Orqanta AI Triage Assessment</span>
                  </div>
                  {order.ai_category && (
                    <Badge variant="secondary" className="capitalize text-xs font-medium">
                      {order.ai_category.replace("_", " ")}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {order.ai_summary}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Description & Details */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-base font-semibold">Reported Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {order.description}
              </p>
            </CardContent>
          </Card>

          {/* Activity Audit Timeline */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="size-4 text-zinc-500" />
                <span>Audit & Activity History</span>
              </CardTitle>
              <CardDescription>Immutable record of status updates and assignments</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              {activities.length === 0 ? (
                <p className="text-xs text-zinc-400">No activity recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 text-xs">
                      <div className="size-2 rounded-full bg-violet-600 mt-1.5 shrink-0" />
                      <div className="flex-1 space-y-0.5">
                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                          {act.action === "work_order.created" && "Work order submitted"}
                          {act.action === "ai.triaged" && "AI triage completed by Orqanta AI"}
                          {act.action === "status.changed" && `Status changed to ${act.meta?.new_status}`}
                          {act.action === "vendor.assigned" && "Vendor assigned to job"}
                          {act.action === "vendor.unassigned" && "Vendor assignment removed"}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {act.actor?.full_name ? `${act.actor.full_name} • ` : ""}
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

        {/* Right Column: Vendor Assignment & Meta */}
        <div className="space-y-6">
          <VendorAssigner
            workOrderId={order.id}
            assignedVendorId={order.vendor_id}
            vendors={vendors}
          />

          {/* Property Context Card */}
          <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Building2 className="size-4 text-zinc-500" />
                Property & Location
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Building:</span>
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {(order.property as any)?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Address:</span>
                <span className="text-zinc-700 dark:text-zinc-300">
                  {(order.property as any)?.address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Unit #:</span>
                <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">
                  {order.unit_number || "Common Area"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
