"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { updatePaymentMethodAction } from "../actions";

interface AddPaymentMethodDialogProps {
  trigger?: React.ReactNode;
  defaultCardholderName?: string;
  onSuccess?: () => void;
}

export function AddPaymentMethodDialog({
  trigger,
  defaultCardholderName = "",
  onSuccess,
}: AddPaymentMethodDialogProps) {
  const [open, setOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState(defaultCardholderName);
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [isPending, startTransition] = useTransition();

  // Helper formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setExpiry(raw);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvc(raw);
  };

  // Detect brand
  const cleanNumber = cardNumber.replace(/\s+/g, "");
  let brandName = "Generic Card";
  let brandColor = "from-zinc-800 to-zinc-950";
  if (cleanNumber.startsWith("4")) {
    brandName = "Visa";
    brandColor = "from-blue-700 via-indigo-800 to-slate-900";
  } else if (cleanNumber.startsWith("5") || cleanNumber.startsWith("2")) {
    brandName = "Mastercard";
    brandColor = "from-amber-600 via-rose-700 to-zinc-900";
  } else if (cleanNumber.startsWith("34") || cleanNumber.startsWith("37")) {
    brandName = "American Express";
    brandColor = "from-emerald-700 via-teal-800 to-slate-900";
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cleanNumber.length < 15) {
      toast.error("Please enter a valid 16-digit card number.");
      return;
    }

    const [expMonth, expYear] = expiry.split("/");
    if (!expMonth || !expYear || expMonth.length !== 2 || expYear.length !== 2) {
      toast.error("Please enter expiry in MM/YY format (e.g. 12/28).");
      return;
    }

    if (!cvc || cvc.length < 3) {
      toast.error("Please enter a valid 3 or 4-digit security code (CVC).");
      return;
    }

    startTransition(async () => {
      const res = await updatePaymentMethodAction({
        cardNumber,
        cardholderName: cardholderName || "Authorized Cardholder",
        expMonth,
        expYear,
        cvc,
        postalCode,
        isDefault,
      });

      if (res.success) {
        toast.success("Payment method updated successfully!");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to update payment method.");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="sm"
            className="bg-[#073b3a] hover:bg-[#0a504d] text-white font-medium text-xs gap-1.5 shadow-sm"
          >
            <CreditCard className="size-3.5" />
            Add Payment Method
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-2xl shadow-xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold text-[#073b3a] flex items-center gap-2">
            <CreditCard className="size-5 text-emerald-700" />
            Add or Update Payment Method
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Card details are encrypted end-to-end. Your card will be charged for upcoming plan renewals.
          </DialogDescription>
        </DialogHeader>

        {/* Live Card Preview */}
        <div
          className={`relative rounded-xl p-5 text-white bg-gradient-to-tr ${brandColor} shadow-md overflow-hidden transition-all duration-300`}
        >
          {/* Card subtle pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px]" />
          
          <div className="relative z-10 flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase opacity-90">
              <Sparkles className="size-3.5 text-amber-300" />
              {brandName}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-400/20">
              <Lock className="size-3" />
              256-Bit Encrypted
            </div>
          </div>

          <div className="relative z-10 font-mono text-lg tracking-[0.2em] mb-4">
            {cardNumber || "•••• •••• •••• ••••"}
          </div>

          <div className="relative z-10 flex justify-between items-end text-xs">
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-300">Cardholder</div>
              <div className="font-medium tracking-wide truncate max-w-[180px]">
                {cardholderName || "YOUR NAME"}
              </div>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-wider text-slate-300">Expires</div>
              <div className="font-mono font-medium">{expiry || "MM/YY"}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label htmlFor="cardholderName" className="text-xs font-semibold text-slate-700">
              Cardholder Name
            </Label>
            <Input
              id="cardholderName"
              placeholder="e.g. Alexandra Chen"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cardNumber" className="text-xs font-semibold text-slate-700">
              Card Number
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="4242 •••• •••• 4242"
                value={cardNumber}
                onChange={handleCardNumberChange}
                required
                maxLength={19}
                className="text-xs font-mono h-9 pr-10"
              />
              <CreditCard className="size-4 text-slate-400 absolute right-3 top-2.5" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="expiry" className="text-xs font-semibold text-slate-700">
                Expiration (MM/YY)
              </Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={handleExpiryChange}
                required
                maxLength={5}
                className="text-xs font-mono h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cvc" className="text-xs font-semibold text-slate-700">
                Security Code (CVC)
              </Label>
              <Input
                id="cvc"
                type="password"
                placeholder="123"
                value={cvc}
                onChange={handleCvcChange}
                required
                maxLength={4}
                className="text-xs font-mono h-9"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="postalCode" className="text-xs font-semibold text-slate-700">
              Billing Postal / ZIP Code
            </Label>
            <Input
              id="postalCode"
              placeholder="e.g. 78701 or 560001"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="text-xs h-9"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="size-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isDefault" className="text-xs text-slate-600 select-none cursor-pointer">
              Set as primary payment method for recurring billing
            </label>
          </div>

          <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              size="sm"
              className="bg-[#073b3a] hover:bg-[#0a504d] text-white font-semibold text-xs h-9 gap-1.5"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving Card...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-3.5" />
                  Save Payment Method
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
