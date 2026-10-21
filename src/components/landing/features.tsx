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
    title: "Supabase Multi-Tenant RLS",
    badge: "Enterprise Security",
    description:
      "Bank-grade Row Level Security enforced directly at the Postgres engine level. Every organization's data, properties, and tickets remain strictly isolated.",
    accent: "from-purple-500/20 to-indigo-500/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
  },
  {
    icon: Code2,
    title: "Zero-Login Public Tenant SDK",
    badge: "1-Line Embed",
    description:
      "Embed a high-converting maintenance submission widget into any existing building website or tenant portal with a single `<script>` tag and public API key.",
    accent: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
  },
  {
    icon: BellRing,
    title: "Automated Resend Email Loops",
    badge: "Transactional Dispatch",
    description:
      "Keep tenants and vendors synchronized without manual phone calls. Automatic email updates fire on creation, vendor assignment, and resolution.",
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
    <section id="features" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-blue-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-violet-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5 text-blue-400" />
            <span>Built for 50–500 Unit Portfolios</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Engineered to Run Maintenance on Autopilot
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
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
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`p-6 sm:p-7 rounded-2xl bg-zinc-900/60 border ${feature.border} hover:bg-zinc-900/90 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 backdrop-blur-sm relative overflow-hidden flex flex-col justify-between`}
              >
                {/* Glow accent in corner */}
                <div
                  className={`absolute -top-12 -right-12 w-28 h-28 bg-gradient-to-br ${feature.accent} blur-2xl rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="size-11 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner">
                      <Icon className={`size-5 ${feature.iconColor}`} />
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/60">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center gap-2 text-xs text-zinc-500 font-medium group-hover:text-zinc-300 transition-colors">
                  <CheckCircle className="size-3.5 text-emerald-400" />
                  <span>Production Ready</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
