"use client";

import * as React from "react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { ShieldAlert, RotateCw, CheckCircle2, Wrench } from "lucide-react";
import { toast } from "sonner";
import {
  simulateFailedPaymentAction,
  clearFailedPaymentAction,
  mockLockSubscriptionAction,
} from "../actions";

interface BillingTestToolsProps {
  isFailed: boolean;
}

export function BillingTestTools({ isFailed }: BillingTestToolsProps) {
  const [isPending, startTransition] = useTransition();

  const handleSimulateFailure = () => {
    startTransition(async () => {
      const res = await simulateFailedPaymentAction(
        "Card declined: Insufficient funds or card issuer temporary security hold."
      );
      if (res.success) {
        toast.warning(
          "Simulated Payment Failure active! Check the prominent warning banner and recovery options."
        );
      } else {
        toast.error("Failed to simulate error");
      }
    });
  };

  const handleClearFailure = () => {
    startTransition(async () => {
      const res = await clearFailedPaymentAction();
      if (res.success) {
        toast.success("Payment failure cleared. Subscription restored to healthy status.");
      } else {
        toast.error("Failed to clear error");
      }
    });
  };

  const handleLock = () => {
    startTransition(async () => {
      await mockLockSubscriptionAction();
    });
  };

  return (
    <div className="rounded-xl border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
            <Wrench className="size-3.5 text-amber-600" />
            Evaluation & Testing Controls
          </div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-400">
            Easily test payment failure recovery workflows, top banner alerts, and paywall behaviors.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {!isFailed ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={handleSimulateFailure}
              className="text-xs h-8 border-amber-400 text-amber-900 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/40"
            >
              <ShieldAlert className="size-3.5 mr-1 text-amber-600" />
              Simulate Failed Payment
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={handleClearFailure}
              className="text-xs h-8 border-emerald-400 text-emerald-800 hover:bg-emerald-50 dark:text-emerald-300"
            >
              <CheckCircle2 className="size-3.5 mr-1 text-emerald-600" />
              Clear Failure
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={handleLock}
            className="text-xs h-8 text-amber-800 hover:bg-amber-100 dark:text-amber-300"
          >
            Lock Workspace (Trial Expiry)
          </Button>
        </div>
      </div>
    </div>
  );
}
