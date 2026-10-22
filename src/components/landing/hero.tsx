"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Wrench,
  AlertTriangle,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  isAuthenticated: boolean;
}

export function LandingHero({ isAuthenticated }: HeroProps) {
  return (
    <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden bg-[#fbfcfa] text-[#0b292b]">
      {/* Subtle Ambient Emerald Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Release Tag */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef5f1] border border-[#cbdad3] text-emerald-800 text-xs sm:text-sm font-semibold mb-6 shadow-sm"
          >
            <Sparkles className="size-3.5 text-emerald-700" />
            <span>Property maintenance, without the chaos</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            <span className="text-slate-500 text-xs hidden sm:inline">Powered by Orqanta AI</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-[68px] font-semibold tracking-[-.04em] text-[#073b3a] leading-[1.08]"
          >
            Maintenance operations that{" "}
            <span className="text-emerald-700">
              triage, dispatch, & resolve
            </span>{" "}
            autonomously.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed"
          >
            Stop drowning in late-night tenant texts and emergency contractor scramble. Orqanta gives property managers (50–500 units) an automated command center with instant trade categorization and tenant isolation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link
              href={isAuthenticated ? "/dashboard" : "/signup"}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 rounded-md bg-[#073b3a] hover:bg-[#0a504d] text-white font-semibold text-base shadow-sm gap-2 transition-all"
              >
                <span>{isAuthenticated ? "Launch Dashboard" : "Start 7-Day Free Trial"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <a href="#interactive-demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-7 rounded-md border border-slate-300 bg-white text-[#073b3a] hover:bg-[#eef5f1] font-medium text-base gap-2 transition-all shadow-sm"
              >
                <Play className="size-4 text-emerald-700 fill-emerald-700" />
                <span>Live Interactive Demo</span>
              </Button>
            </a>
          </motion.div>

          {/* Social Proof / Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-600 font-medium"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-700" />
              <span>Enterprise Data Isolation</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-emerald-700" />
              <span>&lt; 3.2s Orqanta AI Triage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-700" />
              <span>No Credit Card Required</span>
            </div>
          </motion.div>
        </div>

        {/* Perspective SaaS Mockup Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 sm:mt-16 relative mx-auto max-w-5xl rounded-xl border border-slate-200 bg-white p-2 sm:p-4 shadow-[0_24px_80px_rgba(4,38,38,0.08)]"
        >
          {/* Top Mockup Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 mb-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-2.5 rounded-full bg-rose-400" />
                <div className="size-2.5 rounded-full bg-amber-400" />
                <div className="size-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-[11px] text-slate-400 ml-2">
                app.orqanta.com/work-orders/live-triage
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-800 bg-[#eef5f1] px-2.5 py-0.5 rounded border border-[#cbdad3]">
              <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Realtime Triage Active
            </div>
          </div>

          {/* Inner Simulated App Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-2 sm:p-4 bg-[#fbfcfa] rounded-lg border border-slate-200">
            {/* Left simulated sidebar mini */}
            <div className="hidden lg:flex lg:col-span-3 flex-col justify-between p-3.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                  <Image
                    src="/orqanta-logo.png"
                    alt="Logo"
                    width={90}
                    height={38}
                    className="h-auto w-[85px] object-contain object-left"
                  />
                </div>
                <div className="space-y-1 text-slate-600">
                  <div className="px-2.5 py-1.5 rounded bg-[#eef5f1] text-[#073b3a] font-semibold flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Wrench className="size-3.5 text-emerald-700" />
                      Live Tickets
                    </span>
                    <span className="text-[10px] bg-emerald-700/20 text-emerald-900 px-1.5 rounded font-mono">
                      4
                    </span>
                  </div>
                  <div className="px-2.5 py-1.5 hover:text-slate-900 flex items-center gap-2">
                    <Clock className="size-3.5 text-slate-400" />
                    Dispatch Queue
                  </div>
                  <div className="px-2.5 py-1.5 hover:text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-slate-400" />
                    Vendor Compliance
                  </div>
                </div>
              </div>
              <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 flex items-center justify-between font-mono">
                <span>Org: Grand Oak</span>
                <span className="text-emerald-700 font-medium">Isolated</span>
              </div>
            </div>

            {/* Main Ticket Highlight Preview */}
            <div className="col-span-1 md:col-span-12 lg:col-span-9 space-y-3">
              {/* Highlight Ticket Card */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-slate-500 font-semibold">
                      #WO-4029
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <AlertTriangle className="size-3" />
                      Urgent Emergency
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Plumbing
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">2 minutes ago</span>
                </div>

                <div className="mt-3">
                  <h4 className="text-base font-semibold text-[#073b3a]">
                    Main water pipe leaking into hallway ceiling
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Grand Oak Apartments • Unit 304 (Damage observed directly below Unit 404 riser)
                  </p>
                </div>

                {/* AI Intelligence Drawer Box */}
                <div className="mt-4 p-4 rounded-lg bg-[#073b3a] text-white space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-emerald-300" />
                      <span className="text-xs font-semibold text-emerald-100">
                        Orqanta AI Autonomous Triage
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
                      99.6% Trade Confidence
                    </span>
                  </div>

                  <p className="text-xs text-emerald-50/90 leading-relaxed font-sans">
                    Identified high-velocity water ingress risking electrical junction box. Immediate shutoff valve isolation recommended.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-xs">
                    <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between">
                      <span className="text-emerald-200/80">Assigned Contractor:</span>
                      <span className="text-white font-medium">Apex Emergency Plumbing</span>
                    </div>
                    <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between">
                      <span className="text-emerald-200/80">Insurance Status:</span>
                      <span className="text-emerald-300 font-medium flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        Verified Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
