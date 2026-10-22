"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Building2, Search, ArrowUpRight, Wrench } from "lucide-react";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/utils";

interface DashboardTicketsProps {
  orders: any[];
}

export function DashboardTickets({ orders }: DashboardTicketsProps) {
  const [filter, setFilter] = React.useState<"all" | "open" | "in_progress" | "urgent">("all");
  const [search, setSearch] = React.useState("");

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      // Filter by tab
      if (filter === "open" && order.status !== "open") return false;
      if (filter === "in_progress" && order.status !== "in_progress") return false;
      if (filter === "urgent" && order.priority !== "urgent" && order.priority !== "high") return false;

      // Filter by search text
      if (search.trim()) {
        const query = search.toLowerCase();
        const titleMatch = order.title?.toLowerCase().includes(query);
        const propMatch = (order.property?.name || "").toLowerCase().includes(query);
        const categoryMatch = (order.ai_category || "").toLowerCase().includes(query);
        const descMatch = (order.description || "").toLowerCase().includes(query);
        return titleMatch || propMatch || categoryMatch || descMatch;
      }

      return true;
    });
  }, [orders, filter, search]);

  const openCount = orders.filter((o) => o.status === "open").length;
  const inProgCount = orders.filter((o) => o.status === "in_progress").length;
  const urgentCount = orders.filter((o) => o.priority === "urgent" || o.priority === "high").length;

  return (
    <div className="space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-[#073b3a] text-base">
            Recent Maintenance Requests
          </h3>
          <span className="text-[11px] font-medium text-emerald-800 bg-[#f2f8f6] border border-emerald-200/80 px-2 py-0.5 rounded-full">
            AI Triaged
          </span>
        </div>

        <Link
          href="/work-orders"
          className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>View full queue ({orders.length})</span>
          <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Interactive Tabs & Quick Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-[#073b3a] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-[#073b3a] hover:bg-[#eef5f1] border border-[#dfe8e3]"
            }`}
          >
            All ({orders.length})
          </button>
          <button
            onClick={() => setFilter("open")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "open"
                ? "bg-[#073b3a] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-[#073b3a] hover:bg-[#eef5f1] border border-[#dfe8e3]"
            }`}
          >
            Open ({openCount})
          </button>
          <button
            onClick={() => setFilter("in_progress")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "in_progress"
                ? "bg-[#073b3a] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-[#073b3a] hover:bg-[#eef5f1] border border-[#dfe8e3]"
            }`}
          >
            In Progress ({inProgCount})
          </button>
          <button
            onClick={() => setFilter("urgent")}
            className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
              filter === "urgent"
                ? "bg-rose-700 text-white shadow-sm"
                : "bg-white text-rose-700 hover:bg-rose-50 border border-rose-200"
            }`}
          >
            Urgent ({urgentCount})
          </button>
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-48">
          <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-8 pl-8 pr-2.5 rounded-lg border border-[#dfe8e3] bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Ticket Cards List */}
      {filteredOrders.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[#dfe8e3] bg-white p-10 text-center shadow-sm">
          <div className="size-10 rounded-full bg-[#f2f8f6] text-[#073b3a] flex items-center justify-center mx-auto mb-2.5">
            <Wrench className="size-4 text-emerald-700" />
          </div>
          <p className="text-sm font-semibold text-[#073b3a]">
            No tickets match your filter
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Try switching filter tabs or clearing your search.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredOrders.map((order) => (
            <Link
              key={order.id}
              href={`/work-orders/${order.id}`}
              className="block group"
            >
              <div className="rounded-xl border border-[#dfe8e3] bg-white p-4 shadow-sm hover:border-emerald-600/50 hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 min-w-0 flex-1">
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

                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Building2 className="size-3 text-emerald-700 shrink-0" />
                      <span>{(order.property as any)?.name}</span>
                      {order.unit_number && <span>• Unit {order.unit_number}</span>}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#dfe8e3]/60 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      {formatDate(order.created_at)}
                    </span>
                    <span className="text-emerald-700 font-semibold inline-flex items-center gap-1 text-xs group-hover:underline">
                      <span>View</span>
                      <ArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
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
