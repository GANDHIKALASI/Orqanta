"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, TrendingUp, Clock, ShieldCheck, Smile } from "lucide-react";

export function LandingComparisonRoi() {
  return (
    <section id="roi" className="py-14 sm:py-16 bg-white border-y border-[#dfe8e3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700 mb-2">
            Proven Operational Impact
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#073b3a]">
            Stop Managing Maintenance in Chaos
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Compare the headache of legacy spreadsheets and endless phone calls with Orqanta&apos;s intelligent automation.
          </p>
        </div>

        {/* 3 Metric Stat Highlights */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35 }}
            className="p-4 sm:p-5 rounded-xl bg-[#fbfcfa] border border-slate-200 text-center"
          >
            <div className="size-9 rounded-lg bg-[#eef5f1] text-emerald-700 mx-auto flex items-center justify-center mb-2.5">
              <Clock className="size-4.5" />
            </div>
            <div className="text-3xl font-bold text-[#073b3a] tracking-tight">8 mins</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Average Dispatch Speed</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Down from 4.5+ hours manually</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.06 }}
            className="p-4 sm:p-5 rounded-xl bg-[#fbfcfa] border border-slate-200 text-center"
          >
            <div className="size-9 rounded-lg bg-[#eef5f1] text-emerald-700 mx-auto flex items-center justify-center mb-2.5">
              <ShieldCheck className="size-4.5" />
            </div>
            <div className="text-3xl font-bold text-[#073b3a] tracking-tight">100%</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Vendor Insurance Guard</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Zero unauthorized contractor liability</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.12 }}
            className="p-4 sm:p-5 rounded-xl bg-[#fbfcfa] border border-slate-200 text-center"
          >
            <div className="size-9 rounded-lg bg-[#eef5f1] text-emerald-700 mx-auto flex items-center justify-center mb-2.5">
              <Smile className="size-4.5" />
            </div>
            <div className="text-3xl font-bold text-[#073b3a] tracking-tight">4.9 / 5.0</div>
            <div className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">Tenant Satisfaction</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Due to immediate automated triage alerts</div>
          </motion.div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {/* Legacy / Manual Approach */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-5 sm:p-6 rounded-xl bg-rose-50/50 border border-rose-200 space-y-3.5"
          >
            <div className="flex items-center gap-3 pb-2.5 border-b border-rose-200/80">
              <XCircle className="size-5 text-rose-600" />
              <div>
                <h3 className="text-base font-semibold text-rose-950">Traditional Maintenance Chaos</h3>
                <p className="text-xs text-rose-700">Phone calls, texts, and spreadsheets</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Tenants text vague descriptions with no unit info or photos.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Managers spend 30+ minutes guessing trades and calling contractors.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Uninsured vendors accidentally dispatched, creating severe liability.</span>
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                <span>Tickets get lost in personal email inboxes during weekends.</span>
              </li>
            </ul>
          </motion.div>

          {/* Orqanta Autonomous Platform */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="p-5 sm:p-6 rounded-xl bg-[#073b3a] text-white border border-[#073b3a] shadow-lg space-y-3.5"
          >
            <div className="flex items-center gap-3 pb-2.5 border-b border-white/10">
              <CheckCircle2 className="size-5 text-emerald-400" />
              <div>
                <h3 className="text-base font-semibold text-white">The Orqanta Autonomous Way</h3>
                <p className="text-xs text-emerald-200/80">Intelligent, audited, and isolated</p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-100/90">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>High-resolution photo ingestion with immediate Orqanta AI analysis.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instant trade taxonomy with priority classification in under 3 seconds.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated compliance checks verify active contractor insurance.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instant automated status notifications keep tenants and owners informed.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
