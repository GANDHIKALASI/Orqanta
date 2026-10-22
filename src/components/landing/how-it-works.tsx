"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Send, Sparkles, UserCheck, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Send,
    title: "Tenant Submits Request",
    subtitle: "Via Mobile App or Web Embed",
    description:
      "Tenants describe the maintenance issue and attach high-res damage photos. Submitted instantly through your resident portal or building QR stickers.",
    highlight: "Zero Friction Entry",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Orqanta AI Classifies & Matches",
    subtitle: "Autonomous Analysis in 3s",
    description:
      "Orqanta AI analyzes text & context to pinpoint the exact trade (e.g. Plumbing vs. HVAC), assesses emergency urgency, and pairs the best insured contractor.",
    highlight: "99%+ Accuracy",
  },
  {
    number: "03",
    icon: UserCheck,
    title: "1-Click Approval & Dispatch",
    subtitle: "Real-Time Tracking & Resolution",
    description:
      "Property managers review the AI recommendation and dispatch with one click. Automated dispatch alerts notify the vendor and keep the tenant updated at every step.",
    highlight: "Automated Communication",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-14 sm:py-16 bg-[#fbfcfa] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700 mb-2">
            Operational Workflow
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#073b3a]">
            From Issue to Dispatched Contractor in Seconds
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            A frictionless, intelligent pipeline that removes the property manager as the manual bottleneck.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-600/40 hover:shadow-[0_8px_24px_rgba(4,38,38,0.05)] transition-all duration-200 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold font-mono text-emerald-700/60 group-hover:text-emerald-700 transition-colors">
                      {step.number}
                    </span>
                    <div className="size-10 rounded-lg bg-[#eef5f1] border border-[#dfe8e3] flex items-center justify-center text-emerald-700 shadow-sm group-hover:scale-105 transition-transform">
                      <Icon className="size-4.5 text-emerald-700" />
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                    {step.subtitle}
                  </span>

                  <h3 className="text-base sm:text-lg font-semibold text-[#073b3a] mt-1">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#dfe8e3] flex items-center gap-2 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  <span>{step.highlight}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

