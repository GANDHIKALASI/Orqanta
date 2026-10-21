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
      "Tenants describe the maintenance issue and attach high-res damage photos. Submitted through the authenticated app or your zero-login resident portal.",
    highlight: "Zero Friction Entry",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Gemini 3.8 Classifies & Matches",
    subtitle: "Autonomous Analysis in 3s",
    description:
      "Google Gemini analyzes text & context to pinpoint the exact trade (e.g. Plumbing vs. HVAC), assesses emergency urgency, and pairs the best insured contractor.",
    highlight: "99%+ Accuracy",
  },
  {
    number: "03",
    icon: UserCheck,
    title: "1-Click Approval & Dispatch",
    subtitle: "Real-Time Tracking & Resolution",
    description:
      "Property managers review the AI recommendation and dispatch with one click. Automated Resend emails alert the vendor and keep the tenant updated at every step.",
    highlight: "Automated Communication",
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-zinc-950 relative overflow-hidden border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5 text-indigo-400" />
            <span>Operational Workflow</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            From Tenant Issue to Dispatched Contractor in Seconds
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            A frictionless, intelligent pipeline that removes the property manager as the manual bottleneck.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between relative group hover:shadow-xl hover:shadow-black/60"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-extrabold font-mono text-zinc-700 group-hover:text-blue-400/80 transition-colors">
                      {step.number}
                    </span>
                    <div className="size-12 rounded-xl bg-gradient-to-tr from-zinc-900 to-zinc-800 border border-zinc-700/60 flex items-center justify-center text-blue-400 shadow-md">
                      <Icon className="size-5" />
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block">
                    {step.subtitle}
                  </span>

                  <h3 className="text-xl font-bold text-white mt-1 group-hover:text-zinc-100 transition-colors">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-800 flex items-center gap-2 text-xs font-medium text-emerald-400">
                  <CheckCircle2 className="size-3.5" />
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
