import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkOrderStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: WorkOrderStatus | string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  open: {
    label: "Open",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
    dot: "bg-amber-500",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
    dot: "bg-blue-500",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
    dot: "bg-emerald-500",
  },
  closed: {
    label: "Closed",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
    dot: "bg-zinc-400",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.open;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.className,
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      <span>{config.label}</span>
    </Badge>
  );
}
