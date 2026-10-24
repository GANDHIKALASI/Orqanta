"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronDown, HelpCircle, ShieldCheck, CreditCard, Receipt, RefreshCw } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category?: string;
}

const billingFaqs: FaqItem[] = [
  {
    question: "How does payment processing via Razorpay work?",
    answer:
      "All transactions are securely routed through Razorpay's PCI-DSS Level 1 certified gateway. You can complete payments using UPI (Google Pay, PhonePe, Paytm, Cred, BHIM), Credit & Debit Cards (Visa, Mastercard, RuPay, American Express), Netbanking across 50+ banks, or Corporate Cards. Upon successful payment, your workspace is activated immediately with zero waiting.",
  },
  {
    question: "Where can I find and download official VAT / Tax invoices?",
    answer:
      "Click on the 'Invoices & Tax Receipts' tab above. Every payment generates a legally compliant tax receipt with your Company Legal Entity Name, Registered Billing Address, and VAT / Tax / GSTIN number. You can view or download a printable PDF invoice with one click anytime for accounting and tax deductions.",
  },
  {
    question: "Can I have invoices sent to my finance or accounting team?",
    answer:
      "Yes! In the 'Billing Contact & Tax Info' tab, enter your dedicated billing contact email (e.g. finance@yourcompany.com). All future renewal notifications, payment receipts, and tax invoices will be dispatched directly to that address, completely separate from your personal manager login.",
  },
  {
    question: "What happens if a recurring renewal payment fails?",
    answer:
      "If a payment fails, Orqanta grants a 3-day grace period during which your workspace remains fully functional. A prominent banner surfaces in the app with the decline reason and a one-click 'Retry Payment Now' button. You can also update or replace your card anytime to resolve the payment before access is restricted.",
  },
  {
    question: "Can I switch plans or cancel auto-renewal anytime?",
    answer:
      "Yes, you can upgrade from Monthly to Annual Pro anytime to save 16% (₹1,999/year vs ₹2,388/year). You can also turn off auto-renewal with one click directly from the 'Current Plan & Renewal Schedule' card above. Your access will stay active until the end of your prepaid period.",
  },
  {
    question: "Are there any hidden per-door, per-unit, or per-ticket fees?",
    answer:
      "None at all. Unlike legacy property management software that charges $1 to $3 per door every month, Orqanta provides flat-rate pricing with unlimited properties, unlimited doors, unlimited resident ticket submissions, and unlimited AI triage.",
  },
];

export function BillingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Card className="rounded-2xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
      <CardHeader className="p-5 pb-3 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60">
        <div className="flex items-center gap-2">
          <HelpCircle className="size-4 text-emerald-700" />
          <CardTitle className="text-base font-bold text-[#073b3a]">
            Billing & Subscription FAQ
          </CardTitle>
        </div>
        <CardDescription className="text-xs text-slate-500 mt-0.5">
          Common questions about Razorpay payments, tax compliance, receipts, and plan flexibility
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 space-y-3">
        {billingFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={faq.question}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? "border-emerald-600/40 bg-white shadow-xs"
                  : "border-slate-200/80 bg-[#fbfcfa]/60 hover:border-slate-300"
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
              >
                <span className="font-semibold text-[#073b3a] text-xs sm:text-sm">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-180 text-emerald-700" : "text-slate-400"
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-4 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-700 font-medium">
            <ShieldCheck className="size-3.5 text-emerald-700" />
            <span>Payments secured by Razorpay (Live Gateway)</span>
          </div>
          <span>
            Need custom enterprise invoicing? Reach out at{" "}
            <a href="mailto:billing@orqanta.com" className="text-emerald-700 font-semibold hover:underline">
              billing@orqanta.com
            </a>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
