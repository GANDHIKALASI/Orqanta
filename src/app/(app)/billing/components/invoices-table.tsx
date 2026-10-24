"use client";

import * as React from "react";
import { useState } from "react";
import { BillingDetails, BillingInvoice } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Percent,
  Receipt,
  Building2,
} from "lucide-react";
import { InvoiceModal } from "./invoice-modal";

interface InvoicesTableProps {
  invoices: BillingInvoice[];
  billingDetails: BillingDetails;
}

export function InvoicesTable({ invoices, billingDetails }: InvoicesTableProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleViewInvoice = (inv: BillingInvoice) => {
    setSelectedInvoice(inv);
    setModalOpen(true);
  };

  const handleDownloadPdf = (inv: BillingInvoice) => {
    setSelectedInvoice(inv);
    setModalOpen(true);
    // Give modal a tick to open before initiating browser print dialog
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <>
      <Card className="rounded-2xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
        <CardHeader className="p-5 pb-3 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-[#073b3a] flex items-center gap-2">
              <Receipt className="size-4 text-emerald-700" />
              Invoices & Payment Receipts
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Itemized history of all charges including VAT/Tax breakdown, legal entity name, and downloadable PDFs
            </CardDescription>
          </div>
          {billingDetails.vat_number && (
            <Badge
              variant="outline"
              className="text-[11px] font-mono bg-slate-50 text-slate-700 border-slate-300 w-fit"
            >
              Tax / VAT ID: {billingDetails.vat_number}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {invoices.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <FileText className="size-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-700">No invoices generated yet</p>
              <p className="text-xs text-slate-500">
                Invoices will be automatically created upon plan activation and renewal.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#fbfcfa] border-b border-[#dfe8e3] text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5 pl-5">Invoice #</th>
                    <th className="p-3.5">Billing Date</th>
                    <th className="p-3.5">Plan / Description</th>
                    <th className="p-3.5 text-right">Subtotal</th>
                    <th className="p-3.5 text-right">Tax / VAT (18%)</th>
                    <th className="p-3.5 text-right">Total Paid</th>
                    <th className="p-3.5 text-center">Status</th>
                    <th className="p-3.5 pr-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#dfe8e3]/60">
                  {invoices.map((inv) => {
                    const formattedDate = new Date(inv.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                    const currencySymbol = inv.currency === "INR" ? "₹" : "$";

                    return (
                      <tr
                        key={inv.id}
                        className="hover:bg-[#f8fbf9] transition-colors group"
                      >
                        <td className="p-3.5 pl-5 font-mono font-bold text-slate-900">
                          {inv.invoice_number}
                        </td>
                        <td className="p-3.5 text-slate-600 whitespace-nowrap">
                          {formattedDate}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-slate-900">{inv.plan_name}</div>
                          <div className="text-[10px] text-slate-400">
                            {inv.billing_period || "Annual Subscription"}
                          </div>
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-600">
                          {currencySymbol}
                          {inv.subtotal.toFixed(2)}
                        </td>
                        <td className="p-3.5 text-right font-mono text-slate-600">
                          {currencySymbol}
                          {inv.tax_amount.toFixed(2)}
                        </td>
                        <td className="p-3.5 text-right font-mono font-bold text-[#073b3a]">
                          {currencySymbol}
                          {inv.amount.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-center">
                          {inv.status === "paid" ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold gap-1 py-0 h-5"
                            >
                              <CheckCircle2 className="size-2.5" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px] py-0 h-5">
                              {inv.status.toUpperCase()}
                            </Badge>
                          )}
                        </td>
                        <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewInvoice(inv)}
                              className="h-7 text-xs font-semibold gap-1 text-slate-700 hover:text-[#073b3a] hover:bg-[#eef5f1] px-2.5"
                            >
                              <Eye className="size-3 text-slate-500" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPdf(inv)}
                              className="h-7 text-xs font-semibold gap-1 text-[#073b3a] border-slate-300 hover:bg-[#eef5f1] px-2.5"
                            >
                              <Download className="size-3 text-emerald-700" />
                              PDF
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 px-5 border-t border-[#dfe8e3]/60 bg-[#fbfcfa]/60 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
            <span>
              All transactions include itemized tax & VAT breakdown. Invoices are certified and tamper-proof.
            </span>
            <div className="flex items-center gap-1.5 font-medium text-slate-700">
              <Building2 className="size-3.5 text-emerald-700" />
              <span>Billed to: {billingDetails.company_name || "Workspace Account"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <InvoiceModal
        invoice={selectedInvoice}
        billingDetails={billingDetails}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
