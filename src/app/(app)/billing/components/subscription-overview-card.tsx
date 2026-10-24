"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { toggleAutoRenewAction } from "../actions";

interface SubscriptionOverviewCardProps {
  plan: "monthly" | "annual";
  planName: string;
  amount: number;
  currency?: string;
  nextBillingDate: string;
  autoRenew: boolean;
  subscriptionStatus: string;
  daysRemaining?: number;
  onSelectPlan?: (plan: "monthly" | "annual") => void;
}

export function SubscriptionOverviewCard({
  plan,
  planName,
  amount,
  currency = "INR",
  nextBillingDate,
  autoRenew: initialAutoRenew,
  subscriptionStatus,
  daysRemaining = 7,
  onSelectPlan,
}: SubscriptionOverviewCardProps) {
  const [autoRenew, setAutoRenew] = useState(initialAutoRenew);
  const [isPending, startTransition] = useTransition();

  const isLocked = subscriptionStatus === "locked";
  const isActive = subscriptionStatus === "active";
  const isTrial = subscriptionStatus === "trialing";

  const formattedDate = new Date(nextBillingDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const currencySymbol = currency === "INR" ? "₹" : "$";

  const handleToggleAutoRenew = () => {
    const nextVal = !autoRenew;
    setAutoRenew(nextVal);
    startTransition(async () => {
      const res = await toggleAutoRenewAction(nextVal);
      if (res.success) {
        toast.success(
          nextVal ? "Auto-renew enabled for next billing cycle" : "Auto-renew disabled"
        );
      } else {
        setAutoRenew(!nextVal);
        toast.error("Failed to update auto-renewal setting");
      }
    });
  };

  return (
    <Card className="rounded-2xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden flex flex-col justify-between">
      <CardHeader className="p-5 pb-3 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-[#073b3a] flex items-center gap-2">
            <Zap className="size-4 text-emerald-700" />
            Current Plan & Renewal Schedule
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Upcoming payment schedule, plan pricing, and renewal management
          </CardDescription>
        </div>
        {isActive ? (
          <Badge className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-2.5 py-0.5">
            Active Subscription
          </Badge>
        ) : isTrial ? (
          <Badge
            variant="outline"
            className="border-amber-400 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-0.5"
          >
            Free Trial ({daysRemaining}d left)
          </Badge>
        ) : (
          <Badge variant="destructive" className="text-xs font-semibold px-2.5 py-0.5">
            Locked
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plan & Amount Box */}
          <div className="p-4 rounded-xl border border-emerald-100 bg-[#f4f9f7] space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
              <span>Active Tier</span>
              {plan === "annual" && (
                <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                  Save 16%
                </span>
              )}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-extrabold text-[#073b3a]">
                {planName}
              </span>
            </div>
            <div className="flex items-baseline gap-1 text-slate-700">
              <span className="text-lg font-bold text-slate-900 font-mono">
                {currencySymbol}
                {amount.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                / {plan === "annual" ? "year" : "month"}
              </span>
              <span className="text-[11px] text-slate-400 ml-1">
                (includes unlimited AI triage & doors)
              </span>
            </div>
          </div>

          {/* Next Billing Date Box */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar className="size-3.5 text-slate-400" />
              <span>Next Billing Date</span>
            </div>
            <div className="text-xl md:text-2xl font-bold text-slate-900">
              {formattedDate}
            </div>
            <div className="text-xs text-slate-500 flex items-center justify-between pt-0.5">
              <span>
                Next Charge:{" "}
                <strong className="text-slate-800 font-mono">
                  {currencySymbol}
                  {amount.toLocaleString()}
                </strong>{" "}
                for {planName}
              </span>
            </div>
          </div>
        </div>

        {/* Auto Renew Setting & Policy */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-[#dfe8e3] bg-white flex-wrap gap-3">
          <div className="space-y-0.5">
            <div className="text-xs font-semibold text-[#073b3a] flex items-center gap-1.5">
              <RefreshCw className="size-3.5 text-emerald-700" />
              Auto-Renewal Setting
            </div>
            <p className="text-[11px] text-slate-500">
              {autoRenew
                ? `Your subscription will automatically renew for ${currencySymbol}${amount} on ${formattedDate}.`
                : "Auto-renew is paused. Access will pause after the current billing cycle."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant={autoRenew ? "outline" : "default"}
              size="sm"
              disabled={isPending}
              onClick={handleToggleAutoRenew}
              className={`h-8 text-xs font-semibold ${
                autoRenew
                  ? "border-slate-300 text-slate-700 hover:bg-slate-100"
                  : "bg-emerald-700 text-white hover:bg-emerald-600"
              }`}
            >
              {isPending ? (
                <Loader2 className="size-3 animate-spin mr-1.5" />
              ) : null}
              {autoRenew ? "Turn Off Auto-Renew" : "Enable Auto-Renew"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
