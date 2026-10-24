"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { FailedPaymentInfo } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  RotateCw,
  CreditCard,
  CheckCircle2,
  HelpCircle,
  Loader2,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { retryFailedPaymentAction, recordRazorpayPaymentAction } from "../actions";
import { initiateRazorpayCheckout } from "@/lib/razorpay";
import { AddPaymentMethodDialog } from "./add-payment-method-dialog";

interface FailedPaymentBannerProps {
  failedPayment: FailedPaymentInfo;
  cardholderName?: string;
  onResolved?: () => void;
}

export function FailedPaymentBanner({
  failedPayment,
  cardholderName = "",
  onResolved,
}: FailedPaymentBannerProps) {
  const [isPending, startTransition] = useTransition();

  const now = new Date();
  const graceDate = new Date(failedPayment.grace_period_ends_at);
  const msRemaining = graceDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

  const handleRetry = async () => {
    try {
      const plan = failedPayment.plan_name.toLowerCase().includes("monthly") ? "monthly" : "annual";
      await initiateRazorpayCheckout({
        plan,
        amount: failedPayment.amount,
        currency: "INR",
        userName: cardholderName,
        onSuccess: (response) => {
          startTransition(async () => {
            const res = await recordRazorpayPaymentAction({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });
            if (res.success) {
              toast.success("Payment succeeded via Razorpay! Your subscription is now fully active.");
              onResolved?.();
            } else {
              toast.error(res.error || "Failed to update subscription");
            }
          });
        },
        onError: () => {
          toast.error("Payment attempt was cancelled or declined.");
        },
      });
    } catch {
      // Fallback to instant server retry
      startTransition(async () => {
        const res = await retryFailedPaymentAction();
        if (res.success) {
          toast.success("Payment succeeded! Your subscription is now fully active.");
          onResolved?.();
        } else {
          toast.error(
            res.error || "Payment attempt failed. Please check your card or add a new one."
          );
        }
      });
    }
  };

  return (
    <div className="rounded-2xl border-2 border-red-500/40 bg-gradient-to-r from-red-500/10 via-rose-500/5 to-transparent p-6 shadow-md backdrop-blur-sm space-y-4">
      {/* Top Banner Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-red-600 text-white shadow-sm shrink-0">
            <AlertTriangle className="size-6 animate-pulse" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="destructive" className="font-bold text-xs uppercase tracking-wider">
                Payment Failed • Action Required
              </Badge>
              <span className="text-xs font-semibold text-red-700 dark:text-red-300 flex items-center gap-1">
                <Clock className="size-3.5" />
                Grace Period: {daysRemaining} {daysRemaining === 1 ? "day" : "days"} before account lock
              </span>
            </div>

            <h3 className="text-lg font-extrabold text-red-950 dark:text-red-100 tracking-tight">
              Renewal Payment Could Not Be Processed
            </h3>

            <p className="text-xs text-red-900/80 dark:text-red-200/90 max-w-2xl">
              We attempted to bill your primary payment method for{" "}
              <strong>₹{failedPayment.amount.toLocaleString()}</strong> ({failedPayment.plan_name}),
              but the transaction was declined by the card processor.
            </p>
          </div>
        </div>

        {/* Immediate Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto shrink-0">
          <Button
            type="button"
            disabled={isPending}
            onClick={handleRetry}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-9 gap-1.5 shadow-sm"
          >
            {isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RotateCw className="size-3.5" />
            )}
            Retry Payment Now
          </Button>

          <AddPaymentMethodDialog
            defaultCardholderName={cardholderName}
            onSuccess={onResolved}
            trigger={
              <Button
                variant="outline"
                className="border-red-300 text-red-800 hover:bg-red-50 text-xs font-semibold h-9 gap-1.5 bg-white"
              >
                <CreditCard className="size-3.5" />
                Update Payment Method
              </Button>
            }
          />
        </div>
      </div>

      {/* Decline Reason & Step-by-Step Recovery Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/90 border border-red-200/80 text-xs">
        <div className="space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <ShieldAlert className="size-4 text-red-600" />
            Processor Decline Reason
          </div>
          <p className="font-mono text-red-700 bg-red-50 p-2.5 rounded-lg border border-red-100">
            {failedPayment.reason}
          </p>
          <p className="text-[11px] text-slate-500">
            Last attempt timestamp: {new Date(failedPayment.failed_at).toLocaleString()}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <HelpCircle className="size-4 text-emerald-700" />
            Recovery Instructions
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px]">
            <li>
              Contact your card issuer to ensure international or recurring SaaS transactions are authorized.
            </li>
            <li>
              Verify that your card has sufficient available credit or account balance.
            </li>
            <li>
              Alternatively, click <strong>&quot;Update Payment Method&quot;</strong> above to enter a replacement card.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
