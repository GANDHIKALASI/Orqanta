"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { activateSubscriptionAction, mockLockSubscriptionAction } from "./actions";
import { Loader2, Zap, ShieldAlert, ArrowRight } from "lucide-react";

export function PayNowButton({
  plan,
  label,
  variant = "default",
  isPopular = false,
}: {
  plan: "monthly" | "annual";
  label: string;
  variant?: "default" | "outline";
  isPopular?: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handlePay = () => {
    startTransition(async () => {
      await activateSubscriptionAction(plan);
    });
  };

  return (
    <Button
      type="button"
      onClick={handlePay}
      disabled={isPending}
      variant={variant}
      className={`w-full py-5 text-sm font-semibold transition-all ${
        isPopular
          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
          : "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900"
      }`}
    >
      {isPending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing Payment...
        </>
      ) : (
        <>
          <Zap className="w-4 h-4 mr-2" />
          {label}
        </>
      )}
    </Button>
  );
}

export function TestLockButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      onClick={() => {
        startTransition(async () => {
          await mockLockSubscriptionAction();
        });
      }}
      disabled={isPending}
      variant="outline"
      size="sm"
      className="text-xs text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950/30"
    >
      {isPending ? (
        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
      ) : (
        <ShieldAlert className="w-3 h-3 mr-1" />
      )}
      Simulate Trial Expiration (Lock App)
    </Button>
  );
}
