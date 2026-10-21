"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateWorkOrderStatusAction } from "../actions";
import type { WorkOrderStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusUpdaterProps {
  workOrderId: string;
  currentStatus: WorkOrderStatus;
}

export function StatusUpdater({ workOrderId, currentStatus }: StatusUpdaterProps) {
  const [isPending, startTransition] = React.useTransition();

  const handleStatusChange = (newStatus: WorkOrderStatus) => {
    startTransition(async () => {
      const result = await updateWorkOrderStatusAction(workOrderId, newStatus);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(`Status updated to ${newStatus}`);
    });
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-zinc-500 hidden sm:inline">Update Status:</span>
      <Select
        defaultValue={currentStatus}
        onValueChange={(val) => handleStatusChange(val as WorkOrderStatus)}
        disabled={isPending}
      >
        <SelectTrigger className="w-[140px] h-9 text-xs font-medium">
          {isPending ? (
            <div className="flex items-center gap-1.5">
              <Loader2 className="size-3 animate-spin" />
              <span>Saving...</span>
            </div>
          ) : (
            <SelectValue />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="open">Open</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
