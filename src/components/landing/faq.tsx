"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How does the Orqanta AI triage engine work?",
    answer:
      "When a tenant submits a ticket with text descriptions and photos, Orqanta AI processes the request asynchronously. It extracts severity cues, matches the exact trade category (e.g., Plumbing, Electrical, HVAC, Appliance, Roofing), and queries your organization's vetted vendor directory to recommend the best contractor with active insurance.",
  },
  {
    question: "Can I collect maintenance requests without making tenants download another app?",
    answer:
      "Yes! Orqanta gives you instant QR codes and direct web ticketing links for every building. You can place QR stickers in common areas or link directly from your resident emails. Tenants can submit tickets and attach photos in seconds with zero login friction.",
  },
  {
    question: "Is my organization's property data private and secure?",
    answer:
      "100% yes. Orqanta enforces enterprise-grade multi-property data isolation. Every work order, building record, tenant conversation, and vendor contract is strictly compartmentalized to your workspace with bank-level encryption. Other property managers or external parties can never access your records.",
  },
  {
    question: "What happens if a contractor's insurance policy expires?",
    answer:
      "Orqanta's compliance guard continuously tracks contractor insurance expiry dates. If a contractor's insurance has expired, they are visually flagged with an alert badge, and the AI dispatcher will prioritize active, compliant vendors first.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "We process payments securely via the official Razorpay gateway. You can pay using all major Credit and Debit Cards (Visa, Mastercard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm, BHIM), Netbanking across 50+ banks, and corporate cards. All transactions are 256-bit encrypted and RBI-compliant.",
  },
  {
    question: "How does the 7-day free trial work?",
    answer:
      "You receive full, unrestricted access to all Orqanta features for 7 days upon signup—no credit card required upfront. If you choose not to subscribe, your workspace locks safely without losing any work orders or building records until you select either the Monthly (₹199/mo) or Annual (₹1,999/yr) plan.",
  },
  {
    question: "Do you issue official VAT / Tax invoices with company details?",
    answer:
      "Yes. Every charge automatically generates a legally compliant tax invoice including your Company Legal Name, Registered Address, and VAT / Tax / GSTIN number. Invoices itemize the 18% tax breakdown and can be downloaded as PDF receipts anytime from your Billing portal.",
  },
  {
    question: "Can I cancel or switch my plan anytime?",
    answer:
      "Yes! You can switch between Monthly and Annual billing or cancel auto-renewal with one click directly from your Billing dashboard. Your access will remain active through the end of your paid billing period.",
  },
  {
    question: "Are there any hidden per-door or per-ticket fees?",
    answer:
      "No. Both the Monthly and Annual plans include unlimited properties, unlimited doors/units, and unlimited tenant maintenance ticket submissions with zero per-door surcharges.",
  },
  {
    question: "How long does onboarding take?",
    answer:
      "Less than 5 minutes. As soon as you sign up, an interactive 3-step onboarding checklist guides you through adding your first property, registering a primary vendor, and creating or receiving your first work order.",
  },
];

export function LandingFaq() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-14 sm:py-16 bg-white border-t border-[#dfe8e3] relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700 mb-2">
            Frequently Asked Questions
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#073b3a]">
            Everything You Need to Know
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Have questions about integrations, security, or deployment? We&apos;ve got answers.
          </p>
        </div>

        <div className="mt-8 space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-emerald-600/40 bg-white shadow-sm"
                    : "border-slate-200/90 bg-[#fbfcfa] hover:border-slate-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                >
                  <span className="font-semibold text-[#073b3a] text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-700" : "text-slate-400"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

