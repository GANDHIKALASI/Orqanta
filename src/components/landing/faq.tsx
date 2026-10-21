"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "How does the Gemini 3.8 AI triage engine work?",
    answer:
      "When a tenant submits a ticket with text descriptions and photos, Orqanta invokes Google Gemini 3.8 Flash asynchronously. It extracts severity cues, matches the exact trade category (e.g., Plumbing, Electrical, HVAC, Appliance, Roofing), and queries your organization's vetted vendor directory to recommend the best contractor with active insurance.",
  },
  {
    question: "Can I embed the ticket submission form on my existing website?",
    answer:
      "Yes! Orqanta provides a lightweight, zero-login Public SDK (~3KB). You simply paste a <script> tag and specify your unique org API key found in your Workspace Settings. Tenants can submit tickets directly from any marketing website, WordPress site, or resident portal without needing to remember another password.",
  },
  {
    question: "Is my organization's property data private from other companies?",
    answer:
      "100% yes. Orqanta is architected on Supabase PostgreSQL with strict Row Level Security (RLS) policies. Every query automatically verifies your organization's JWT claims via an auth_org_id() token hook. It is cryptographically impossible for any tenant or property manager to access records outside their own organization.",
  },
  {
    question: "What happens if a contractor's insurance policy expires?",
    answer:
      "Orqanta's compliance guard continuously tracks contractor insurance expiry dates. If a contractor's insurance has expired, they are visually flagged with an alert badge, and the AI dispatcher will prioritize active, compliant vendors first.",
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
    <section id="faq" className="py-24 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold mb-4">
            <HelpCircle className="size-3.5 text-blue-400" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Everything You Need to Know
          </h2>
          <p className="mt-3 text-base text-zinc-400">
            Have questions about integrations, security, or deployment? We&apos;ve got answers.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-xl border border-zinc-800/90 bg-zinc-900/60 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-zinc-800/40 transition-colors"
                >
                  <span className="font-semibold text-white text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`size-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-blue-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50">
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
