"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Code2,
  BellRing,
  Building2,
  LineChart,
  CheckCircle,
  Cpu,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Cpu,
    title: "Orqanta AI Autonomous Triage",
    badge: "Instant Diagnostics",
    description:
      "Every work order is processed through Orqanta AI in under 3 seconds. It detects 8 specialized trades, estimates urgency, and extracts tenant hazards automatically.",
    accent: "from-blue-500/20 to-violet-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
  },
  {
    icon: ShieldCheck,
    title: "Contractor Compliance & Insurance Guard",
    badge: "Liability Shield",
    description:
      "Never dispatch an expired vendor again. Orqanta tracks policy validity, active licenses, and contractor ratings, warning you before any assignment.",
    accent: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    icon: Layers,
    title: "Isolated Multi-Property Architecture",
    badge: "Enterprise Security",
    description:
      "Bank-grade security and strict data separation. Every property, manager, tenant ticket, and contractor record remains strictly isolated to your organization.",
    accent: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: Code2,
    title: "Zero-Friction Resident Portal & QR Codes",
    badge: "Instant Access",
    description:
      "Empower residents to submit requests in seconds via branded QR stickers in lobbies or embedded web widgets without forcing them through tedious password resets.",
    accent: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: BellRing,
    title: "Automated Real-Time Dispatch Loops",
    badge: "Zero Phone Tag",
    description:
      "Keep tenants, property managers, and vendors synchronized without manual phone calls. Automatic instant notifications fire on ticket creation, vendor assignment, and resolution.",
    accent: "from-pink-500/20 to-rose-500/10",
    border: "border-pink-500/30",
    iconColor: "text-pink-400",
  },
  {
    icon: LineChart,
    title: "Executive AI Portfolio Reports",
    badge: "Predictive Intelligence",
    description:
      "Synthesize thousands of maintenance logs into actionable monthly summaries. Spot repeat appliance failures, compare building costs, and budget smartly.",
    accent: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-24 bg-white border-y border-[#dfe8e3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700 mb-3">
            Portfolio Architecture & Coordination
          </p>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-.04em] text-[#073b3a]">
            Engineered to Run Maintenance on Autopilot
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Everything your operations team needs to eliminate maintenance headaches, protect property assets, and delight residents.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-6 sm:p-7 rounded-xl bg-[#fbfcfa] border border-slate-200/90 hover:border-emerald-600/40 hover:bg-white hover:shadow-[0_12px_32px_rgba(4,38,38,0.06)] transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="size-11 rounded-lg bg-[#eef5f1] border border-[#dfe8e3] flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                      <Icon className="size-5 text-emerald-700" />
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#073b3a] group-hover:text-emerald-800 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#dfe8e3] flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <CheckCircle className="size-3.5 text-emerald-600" />
                  <span>Available on all active plans</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

