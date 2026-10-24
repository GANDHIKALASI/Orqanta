"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  activateSubscriptionAction,
  mockLockSubscriptionAction,
  recordRazorpayPaymentAction,
} from "./actions";
import { initiateRazorpayCheckout, RAZORPAY_KEY_ID } from "@/lib/razorpay";
import { Loader2, Zap, ShieldAlert, CreditCard, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface PayNowButtonProps {
  plan: "monthly" | "annual";
  label: string;
  variant?: "default" | "outline";
  isPopular?: boolean;
  userEmail?: string;
  userName?: string;
  orgName?: string;
}

export function PayNowButton({
  plan,
  label,
  variant = "default",
  isPopular = false,
  userEmail = "",
  userName = "Property Manager",
  orgName = "Orqanta Workspace",
}: PayNowButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false);
  const router = useRouter();

  const isAnnual = plan === "annual";
  const amount = isAnnual ? 1999 : 199;

  const handleRazorpayPay = async () => {
    setIsRazorpayLoading(true);

    try {
      await initiateRazorpayCheckout({
        plan,
        amount,
        currency: "INR",
        userEmail,
        userName,
        orgName,
        onSuccess: async (response) => {
          setIsRazorpayLoading(false);
          toast.loading("Verifying and recording payment...", { id: "rzp-verify" });

          startTransition(async () => {
            const res = await recordRazorpayPaymentAction({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan,
            });

            if (res.success) {
              toast.success(
                `Payment verified! Active on ${plan === "annual" ? "Annual Pro" : "Monthly Starter"}.`,
                { id: "rzp-verify" }
              );
              router.refresh();
            } else {
              toast.error(res.error || "Failed to record payment in system", {
                id: "rzp-verify",
              });
            }
          });
        },
        onError: (err: unknown) => {
          setIsRazorpayLoading(false);
          const errorMsg =
            typeof err === "object" && err !== null && "description" in err
              ? String((err as { description?: unknown }).description)
              : "Payment attempt was unsuccessful. Please try again.";
          toast.error(errorMsg);
        },
        onDismiss: () => {
          setIsRazorpayLoading(false);
          toast.info("Payment window closed.");
        },
      });
    } catch (err: unknown) {
      setIsRazorpayLoading(false);
      const message = err instanceof Error ? err.message : "Failed to open Razorpay payment gateway";
      toast.error(message);
    }
  };

  const loading = isPending || isRazorpayLoading;

  return (
    <Button
      type="button"
      onClick={handleRazorpayPay}
      disabled={loading}
      variant={variant}
      className={`w-full py-5 text-sm font-semibold transition-all ${
        isPopular
          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
          : "bg-[#073b3a] hover:bg-[#0a504d] text-white"
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Opening Razorpay Gateway...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4 mr-2" />
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
