import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkOrderPriority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: WorkOrderPriority | string;
  className?: string;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  low: {
    label: "Low",
    className: "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50",
  },
  high: {
    label: "High",
    className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50",
  },
  urgent: {
    label: "Urgent",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/50 font-semibold animate-pulse",
  },
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority] || priorityConfig.medium;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border uppercase tracking-wide",
        config.className,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
