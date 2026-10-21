"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { XCircle, CheckCircle2, TrendingUp, Clock, ShieldCheck, Smile } from "lucide-react";

export function LandingComparisonRoi() {
  return (
    <section id="roi" className="py-24 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-4">
            <TrendingUp className="size-3.5 text-emerald-400" />
            <span>Proven Operational Impact</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Stop Managing Maintenance in Chaos
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Compare the headache of legacy spreadsheets and endless phone calls with Orqanta&apos;s intelligent automation.
          </p>
        </div>

        {/* 3 Metric Stat Highlights */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center"
          >
            <div className="size-10 rounded-xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center mb-3">
              <Clock className="size-5" />
            </div>
            <div className="text-4xl font-extrabold text-white tracking-tight">8 mins</div>
            <div className="text-sm font-semibold text-zinc-300 mt-1">Average Dispatch Speed</div>
            <div className="text-xs text-zinc-500 mt-1">Down from 4.5+ hours manually</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center"
          >
            <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-3">
              <ShieldCheck className="size-5" />
            </div>
            <div className="text-4xl font-extrabold text-white tracking-tight">100%</div>
            <div className="text-sm font-semibold text-zinc-300 mt-1">Vendor Insurance Guard</div>
            <div className="text-xs text-zinc-500 mt-1">Zero unauthorized contractor liability</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-center"
          >
            <div className="size-10 rounded-xl bg-violet-500/10 text-violet-400 mx-auto flex items-center justify-center mb-3">
              <Smile className="size-5" />
            </div>
            <div className="text-4xl font-extrabold text-white tracking-tight">4.9 / 5.0</div>
            <div className="text-sm font-semibold text-zinc-300 mt-1">Tenant Satisfaction</div>
            <div className="text-xs text-zinc-500 mt-1">Due to immediate automated triage alerts</div>
          </motion.div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Legacy / Manual Approach */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl bg-red-950/10 border border-red-900/30 space-y-4"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-red-900/20">
              <XCircle className="size-6 text-red-500" />
              <div>
                <h3 className="text-lg font-bold text-red-200">Traditional Maintenance Chaos</h3>
                <p className="text-xs text-red-400/80">Phone calls, texts, and spreadsheets</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm text-zinc-400">
              <li className="flex items-start gap-2.5">
                <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <span>Tenants text vague descriptions with no unit info or photos.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <span>Managers spend 30+ minutes guessing trades and calling contractors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <span>Uninsured vendors accidentally dispatched, creating severe liability.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <XCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                <span>Tickets get lost in personal email inboxes during weekends.</span>
              </li>
            </ul>
          </motion.div>

          {/* Orqanta AI Platform */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl bg-gradient-to-br from-blue-950/20 via-zinc-900/80 to-violet-950/20 border border-blue-500/40 space-y-4 shadow-xl shadow-blue-500/10"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-blue-500/20">
              <CheckCircle2 className="size-6 text-emerald-400" />
              <div>
                <h3 className="text-lg font-bold text-white">The Orqanta Autonomous Way</h3>
                <p className="text-xs text-blue-300">Intelligent, audited, and isolated</p>
              </div>
            </div>

            <ul className="space-y-3.5 text-sm text-zinc-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>High-resolution photo ingestion with immediate Orqanta AI analysis.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Instant trade taxonomy with priority classification in under 3 seconds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated compliance checks verify active contractor insurance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Automated Resend transactional emails keep tenants and owners informed.</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
