"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Printer,
  Download,
  Building2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { BillingDetails, BillingInvoice } from "@/lib/types";

interface InvoiceModalProps {
  invoice: BillingInvoice | null;
  billingDetails: BillingDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvoiceModal({
  invoice,
  billingDetails,
  open,
  onOpenChange,
}: InvoiceModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(invoice.created_at).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedPaidDate = invoice.paid_at
    ? new Date(invoice.paid_at).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : formattedDate;

  const currencySymbol = invoice.currency === "INR" ? "₹" : "$";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white p-0 rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Action Bar (Hidden during print) */}
        <div className="print:hidden p-4 px-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="size-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
              Invoice #{invoice.invoice_number}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs font-semibold gap-1.5 border-slate-300 hover:bg-slate-100"
            >
              <Printer className="size-3.5" />
              Print / Save PDF
            </Button>
            <Button
              size="sm"
              onClick={handlePrint}
              className="h-8 text-xs font-semibold gap-1.5 bg-[#073b3a] hover:bg-[#0a504d] text-white shadow-xs"
            >
              <Download className="size-3.5" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Printable Official Invoice Body */}
        <div id="printable-invoice" className="p-8 sm:p-10 space-y-8 bg-white text-slate-800 font-sans">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="size-8 rounded-lg bg-[#073b3a] flex items-center justify-center text-white font-bold text-base">
                  O
                </div>
                <span className="text-xl font-black text-[#073b3a] tracking-tight">
                  Orqanta
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Orqanta Technologies Inc.
                <br />
                500 Tech Ridge Parkway, Suite 300
                <br />
                Austin, TX 78759, United States
                <br />
                Corporate Tax ID: <span className="font-mono text-slate-700 font-medium">US-EIN-74892018</span>
                <br />
                EU/UK VAT ID: <span className="font-mono text-slate-700 font-medium">EU372009842</span>
              </p>
            </div>

            <div className="text-right">
              <Badge className="bg-emerald-600 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider px-3 py-1 mb-2">
                PAID IN FULL
              </Badge>
              <h2 className="text-xl font-bold font-mono text-slate-900 tracking-tight">
                {invoice.invoice_number}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Date: <span className="font-medium text-slate-700">{formattedDate}</span>
                <br />
                Paid Date: <span className="font-medium text-slate-700">{formattedPaidDate}</span>
              </p>
            </div>
          </div>

          {/* Billed To vs Payment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <Building2 className="size-3 text-slate-500" />
                Customer Legal Entity (Billed To)
              </div>
              <div className="text-sm font-bold text-slate-900">
                {billingDetails.company_name || "Account Owner Organization"}
              </div>
              <div className="text-xs text-slate-600 mt-1 space-y-0.5">
                <div>{billingDetails.address_line1 || "Headquarters Address"}</div>
                {billingDetails.address_line2 && <div>{billingDetails.address_line2}</div>}
                <div>
                  {[billingDetails.city, billingDetails.state, billingDetails.postal_code]
                    .filter(Boolean)
                    .join(", ")}
                </div>
                <div>{billingDetails.country || "United States"}</div>
                <div className="pt-1.5 font-semibold text-slate-800">
                  Billing Contact:{" "}
                  <span className="font-medium text-slate-600">
                    {billingDetails.contact_email || "billing@company.com"}
                  </span>
                </div>
                <div className="pt-0.5">
                  <span className="font-semibold text-emerald-800">
                    VAT / Tax / GSTIN:{" "}
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {billingDetails.vat_number || "Not specified (General Business)"}
                  </span>
                </div>
              </div>
            </div>

            <div className="sm:border-l sm:border-slate-200 sm:pl-6">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <CreditCard className="size-3 text-slate-500" />
                Payment Method & Transaction
              </div>
              <div className="text-xs text-slate-700 space-y-1 mt-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Method:</span>
                  <span className="font-medium text-slate-900 uppercase">
                    {invoice.payment_method_brand || "Visa"} ending in{" "}
                    <span className="font-mono font-semibold">
                      {invoice.payment_method_last4 || "4242"}
                    </span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> Settled
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coverage Period:</span>
                  <span className="font-medium text-slate-800">
                    {invoice.billing_period || "Annual Subscription"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Currency:</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {invoice.currency}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3 pl-4">Description</th>
                  <th className="p-3 text-center">Period</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right pr-4">Net Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-3 pl-4">
                    <div className="font-bold text-slate-900 text-xs">{invoice.plan_name}</div>
                    <div className="text-[11px] text-slate-500">
                      AI-Native Property Maintenance Platform • Automated triage & unlimited doors
                    </div>
                  </td>
                  <td className="p-3 text-center text-slate-600">
                    {invoice.billing_period || "1 Year"}
                  </td>
                  <td className="p-3 text-center font-mono">1</td>
                  <td className="p-3 text-right pr-4 font-mono font-semibold text-slate-900">
                    {currencySymbol}
                    {invoice.subtotal.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Subtotal, Tax/VAT, and Total Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Net Amount):</span>
                <span className="font-mono font-medium text-slate-800">
                  {currencySymbol}
                  {invoice.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-200">
                <span>
                  Applicable Tax / VAT ({invoice.tax_rate}%):
                </span>
                <span className="font-mono font-medium text-slate-800">
                  {currencySymbol}
                  {invoice.tax_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-emerald-800 font-extrabold text-base">
                  {currencySymbol}
                  {invoice.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Legal Compliance Footer */}
          <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 leading-relaxed space-y-1">
            <p>
              This invoice constitutes a valid tax receipt for software-as-a-service (SaaS) subscribed from Orqanta Technologies Inc.
              All applicable taxes/VAT are itemized according to international business compliance standards.
            </p>
            <p>
              Questions regarding this charge? Contact{" "}
              <strong className="text-slate-600">billing@orqanta.com</strong> referencing Invoice #{invoice.invoice_number}.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
