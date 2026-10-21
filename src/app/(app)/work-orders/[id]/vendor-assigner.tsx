"use client";

import * as React from "react";
import { toast } from "sonner";
import { Loader2, Users, Check, X } from "lucide-react";
import { assignVendorAction } from "../actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Vendor } from "@/lib/types";

interface VendorAssignerProps {
  workOrderId: string;
  assignedVendorId: string | null;
  vendors: Vendor[];
}

export function VendorAssigner({
  workOrderId,
  assignedVendorId,
  vendors,
}: VendorAssignerProps) {
  const [isPending, startTransition] = React.useTransition();
  const [selectedVendorId, setSelectedVendorId] = React.useState<string>(
    assignedVendorId || "unassigned"
  );

  const handleAssign = (newVendorId: string) => {
    const targetVendor = newVendorId === "unassigned" ? null : newVendorId;
    setSelectedVendorId(newVendorId);

    startTransition(async () => {
      const result = await assignVendorAction(workOrderId, targetVendor);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(targetVendor ? "Vendor assigned! Email dispatched." : "Vendor unassigned");
    });
  };

  const assignedVendor = vendors.find((v) => v.id === assignedVendorId);

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Users className="size-4 text-zinc-500" />
          Vendor Assignment
        </CardTitle>
        <CardDescription className="text-xs">
          Dispatch contractor and notify via email
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-3 space-y-3">
        <div className="space-y-1.5">
          <Select
            value={selectedVendorId}
            onValueChange={handleAssign}
            disabled={isPending}
          >
            <SelectTrigger className="w-full text-xs">
              {isPending ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="size-3 animate-spin" />
                  <span>Updating assignment...</span>
                </div>
              ) : (
                <SelectValue placeholder="Select contractor" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">-- Unassigned --</SelectItem>
              {vendors.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name} ({v.trade.replace("_", " ")})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {assignedVendor && (
          <div className="p-2.5 rounded-md bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-xs space-y-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">{assignedVendor.name}</p>
            <p className="text-zinc-500 font-mono text-[11px]">{assignedVendor.email}</p>
            {assignedVendor.phone && (
              <p className="text-zinc-500 text-[11px]">{assignedVendor.phone}</p>
            )}
            {assignedVendor.rate_notes && (
              <p className="text-zinc-600 dark:text-zinc-400 text-[11px] italic pt-1">
                Rates: {assignedVendor.rate_notes}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
