"use client";

import * as React from "react";
import { PaymentMethod } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AddPaymentMethodDialog } from "./add-payment-method-dialog";

interface PaymentMethodCardProps {
  paymentMethods: PaymentMethod[];
  cardholderName?: string;
}

export function PaymentMethodCard({
  paymentMethods,
  cardholderName = "",
}: PaymentMethodCardProps) {
  const primaryCard = paymentMethods.find((pm) => pm.is_default) || paymentMethods[0];

  const getBrandDetails = (brand: string) => {
    switch (brand.toLowerCase()) {
      case "visa":
        return {
          name: "Visa",
          badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300",
          gradient: "from-[#1a1f71] to-[#0d1b2a]",
        };
      case "mastercard":
        return {
          name: "Mastercard",
          badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
          gradient: "from-[#eb001b] to-[#f79e1b]",
        };
      case "amex":
        return {
          name: "American Express",
          badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
          gradient: "from-[#002663] to-[#4c7ba8]",
        };
      default:
        return {
          name: "Credit Card",
          badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
          gradient: "from-zinc-800 to-zinc-950",
        };
    }
  };

  const brandInfo = primaryCard ? getBrandDetails(primaryCard.brand) : null;

  return (
    <Card className="rounded-2xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden flex flex-col justify-between">
      <CardHeader className="p-5 pb-3 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-[#073b3a] flex items-center gap-2">
            <CreditCard className="size-4 text-emerald-700" />
            Payment Method on File
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Default card used for automated recurring subscription renewals
          </CardDescription>
        </div>
        <AddPaymentMethodDialog
          defaultCardholderName={cardholderName}
          trigger={
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-semibold gap-1.5 border-slate-300 text-[#073b3a] hover:bg-[#eef5f1]"
            >
              <Plus className="size-3.5" />
              Change Card
            </Button>
          }
        />
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {primaryCard ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <div className="flex items-center gap-3.5">
              {/* Card visual badge */}
              <div
                className={`w-14 h-9 rounded-lg bg-gradient-to-r ${
                  brandInfo?.gradient || "from-zinc-800 to-zinc-900"
                } p-1.5 flex flex-col justify-between text-white shadow-xs shrink-0`}
              >
                <div className="flex justify-between items-center text-[7px] font-bold tracking-wider uppercase opacity-90">
                  <span>{primaryCard.brand.toUpperCase()}</span>
                </div>
                <div className="text-[10px] font-mono tracking-wider font-semibold">
                  •••• {primaryCard.last4}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-bold text-slate-900">
                    {brandInfo?.name} ending in <span className="font-mono text-emerald-800">{primaryCard.last4}</span>
                  </span>
                  {primaryCard.is_default && (
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold flex items-center gap-1 py-0 h-5"
                    >
                      <CheckCircle2 className="size-2.5" />
                      Default
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>Expires {primaryCard.exp_month}/{primaryCard.exp_year}</span>
                  <span>•</span>
                  <span className="truncate max-w-[150px]">{primaryCard.cardholder_name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <AddPaymentMethodDialog
                defaultCardholderName={cardholderName}
                trigger={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-semibold text-slate-700 hover:text-[#073b3a] hover:bg-slate-200/60"
                  >
                    Update
                  </Button>
                }
              />
            </div>
          </div>
        ) : (
          <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl space-y-2">
            <CreditCard className="size-8 mx-auto text-slate-400" />
            <p className="text-xs font-semibold text-slate-700">No payment method on file</p>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Add a credit or debit card to ensure uninterrupted property management and AI automation.
            </p>
            <div className="pt-2">
              <AddPaymentMethodDialog defaultCardholderName={cardholderName} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <ShieldCheck className="size-3.5 text-emerald-600 shrink-0" />
          <span>
            Payment credentials tokenized and processed via Razorpay. Only masked last-4 digits are retained.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
