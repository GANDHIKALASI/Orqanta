"use client";

import * as React from "react";
import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Mail,
  Receipt,
  MapPin,
  Save,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { BillingDetails } from "@/lib/types";
import { updateBillingDetailsAction } from "../actions";

interface BillingDetailsFormProps {
  initialDetails: BillingDetails;
}

export function BillingDetailsForm({ initialDetails }: BillingDetailsFormProps) {
  const [details, setDetails] = useState<BillingDetails>(initialDetails);
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: keyof BillingDetails, val: string) => {
    setDetails((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateBillingDetailsAction(details);
      if (res.success) {
        toast.success("Billing and tax details saved successfully!");
      } else {
        toast.error(res.error || "Failed to update billing details");
      }
    });
  };

  return (
    <Card className="rounded-2xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
      <CardHeader className="p-5 pb-3 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60">
        <CardTitle className="text-base font-bold text-[#073b3a] flex items-center gap-2">
          <Building2 className="size-4 text-emerald-700" />
          Company Billing & Tax Information
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 mt-0.5">
          These details are legally required to appear on your invoices, receipts, and VAT filings
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Billing Contact Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="contact_email" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Mail className="size-3.5 text-emerald-700" />
                  Billing Contact Email
                </Label>
                <span className="text-[10px] text-slate-400">Separate from login</span>
              </div>
              <Input
                id="contact_email"
                type="email"
                placeholder="accounting@yourcompany.com"
                value={details.contact_email || ""}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                required
                className="text-xs h-9"
              />
              <p className="text-[11px] text-slate-500">
                Invoices, receipts, and payment alerts will be dispatched directly to this inbox.
              </p>
            </div>

            {/* Legal Entity Name */}
            <div className="space-y-1.5">
              <Label htmlFor="company_name" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="size-3.5 text-emerald-700" />
                Company Legal Entity Name
              </Label>
              <Input
                id="company_name"
                placeholder="e.g. Apex Property Management LLC"
                value={details.company_name || ""}
                onChange={(e) => handleChange("company_name", e.target.value)}
                required
                className="text-xs h-9"
              />
              <p className="text-[11px] text-slate-500">
                The registered legal entity name shown on official tax invoices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tax / VAT Number */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="vat_number" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Receipt className="size-3.5 text-emerald-700" />
                  VAT / Tax ID / GSTIN
                </Label>
                <span className="text-[10px] text-emerald-700 font-medium">B2B Compliance</span>
              </div>
              <Input
                id="vat_number"
                placeholder="e.g. GB987654321, 27AABCO1234F1Z5, or EIN-12345"
                value={details.vat_number || ""}
                onChange={(e) => handleChange("vat_number", e.target.value)}
                className="text-xs font-mono h-9"
              />
              <p className="text-[11px] text-slate-500">
                Required for business expense deduction and VAT reverse-charge mechanisms.
              </p>
            </div>

            {/* Country */}
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-emerald-700" />
                Country / Region
              </Label>
              <Input
                id="country"
                placeholder="e.g. United States, United Kingdom, India, Canada"
                value={details.country || ""}
                onChange={(e) => handleChange("country", e.target.value)}
                required
                className="text-xs h-9"
              />
            </div>
          </div>

          {/* Billing Address */}
          <div className="space-y-1.5">
            <Label htmlFor="address_line1" className="text-xs font-semibold text-slate-700">
              Registered Billing Address
            </Label>
            <Input
              id="address_line1"
              placeholder="Street Address, Suite, or Unit #"
              value={details.address_line1 || ""}
              onChange={(e) => handleChange("address_line1", e.target.value)}
              required
              className="text-xs h-9"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="city" className="text-xs font-semibold text-slate-700">
                City
              </Label>
              <Input
                id="city"
                placeholder="City"
                value={details.city || ""}
                onChange={(e) => handleChange("city", e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="state" className="text-xs font-semibold text-slate-700">
                State / Province
              </Label>
              <Input
                id="state"
                placeholder="State or Region"
                value={details.state || ""}
                onChange={(e) => handleChange("state", e.target.value)}
                className="text-xs h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="postal_code" className="text-xs font-semibold text-slate-700">
                Postal / ZIP Code
              </Label>
              <Input
                id="postal_code"
                placeholder="Postal Code"
                value={details.postal_code || ""}
                onChange={(e) => handleChange("postal_code", e.target.value)}
                className="text-xs font-mono h-9"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Info className="size-3.5 text-slate-400" />
              <span>Updates apply immediately to all upcoming and existing invoices.</span>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              size="sm"
              className="bg-[#073b3a] hover:bg-[#0a504d] text-white font-semibold text-xs h-9 gap-1.5 shadow-sm"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Saving Details...
                </>
              ) : (
                <>
                  <Save className="size-3.5" />
                  Save Billing & Tax Info
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
