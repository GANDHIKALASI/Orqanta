"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Play,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Wrench,
  Building2,
  UserCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  isAuthenticated: boolean;
}

function AutonomousDispatchConsole() {
  return (
    <div className="relative">
      {/* Decorative ambient glowing backdrop */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/10 via-teal-500/15 to-transparent rounded-3xl blur-2xl -z-10 pointer-events-none" />

      {/* Main SaaS Browser / App Container */}
      <div className="overflow-hidden rounded-2xl border border-[#dfe8e3] bg-white shadow-[0_24px_70px_rgba(4,38,38,0.1)]">
        {/* Browser Top Window Chrome */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-[#f8faf9] px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rose-400/80" />
            <span className="size-2.5 rounded-full bg-amber-400/80" />
            <span className="size-2.5 rounded-full bg-emerald-400/80" />
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-slate-200/80 text-[11px] font-mono text-slate-500">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>orqanta.app/operations/autonomous</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
            <Sparkles className="size-3 text-emerald-600" />
            <span className="hidden sm:inline">AI Dispatch Core</span>
            <span>Live</span>
          </div>
        </div>

        {/* Console Interior */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Active Triage Pipeline Card */}
          <div className="rounded-xl border border-emerald-600/20 bg-gradient-to-b from-[#f2f8f6] to-[#fbfcfa] p-4 sm:p-5 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white">
                  Urgent Priority
                </span>
                <span className="text-xs font-semibold text-[#073b3a] flex items-center gap-1">
                  <Building2 className="size-3.5 text-slate-500" />
                  Grand Oak Residences · Unit 304
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold flex items-center gap-1">
                <Clock className="size-3" /> 1.2s Triage
              </span>
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
              &ldquo;Main water riser leaking rapidly above ceiling drywall fixture into living area.&rdquo;
            </p>

            {/* AI Diagnosis Breakdown */}
            <div className="mt-3.5 pt-3 border-t border-emerald-900/10 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              <div className="rounded-lg bg-white/80 p-2 border border-slate-200/60">
                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Classification</span>
                <span className="font-semibold text-[#073b3a]">Plumbing / Water Damage</span>
              </div>
              <div className="rounded-lg bg-white/80 p-2 border border-slate-200/60">
                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Confidence</span>
                <span className="font-semibold text-emerald-700">99.8% Match</span>
              </div>
              <div className="rounded-lg bg-white/80 p-2 border border-slate-200/60 col-span-2 sm:col-span-1">
                <span className="text-slate-400 block text-[9px] uppercase font-bold tracking-wider">Emergency SLA</span>
                <span className="font-semibold text-rose-700">&lt; 45 Min Dispatch</span>
              </div>
            </div>

            {/* Auto-Assigned Contractor Strip */}
            <div className="mt-3 rounded-lg bg-[#073b3a] text-white p-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-7 rounded-md bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <Wrench className="size-3.5" />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-white truncate">Apex Emergency Mechanicals</p>
                  <p className="text-[10px] text-emerald-200/80">Vetted Contractor • 1.2 miles away • 4.9 ★</p>
                </div>
              </div>
              <span className="shrink-0 text-[10px] font-bold px-2 py-1 rounded bg-emerald-500 text-slate-950 flex items-center gap-1">
                <CheckCircle2 className="size-3" /> Dispatched
              </span>
            </div>
          </div>

          {/* Real-Time Platform Status Bar */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="text-lg sm:text-xl font-extrabold text-[#073b3a]">3.4 min</p>
              <p className="text-[10px] text-slate-500 font-medium">Avg. Contractor Dispatch</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="text-lg sm:text-xl font-extrabold text-emerald-700">100%</p>
              <p className="text-[10px] text-slate-500 font-medium">Tenant Isolation (RLS)</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <p className="text-lg sm:text-xl font-extrabold text-[#073b3a]">4.9 / 5</p>
              <p className="text-[10px] text-slate-500 font-medium">Resident Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Modern Accent Badges */}
      <div className="hidden sm:flex items-center gap-2 absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-md border border-[#dfe8e3] p-2.5 px-3.5 rounded-xl shadow-lg shadow-emerald-950/5 text-xs font-semibold text-[#073b3a]">
        <Zap className="size-4 text-emerald-600 fill-emerald-600" />
        <span>70% Faster than manual phone dispatch</span>
      </div>

      <div className="hidden sm:flex items-center gap-2 absolute -top-4 -right-3 bg-[#073b3a] text-white p-2.5 px-3.5 rounded-xl shadow-lg text-xs font-medium border border-emerald-500/20">
        <ShieldCheck className="size-4 text-emerald-400" />
        <span>Multi-Tenant Enterprise RLS</span>
      </div>
    </div>
  );
}

export function LandingHero({ isAuthenticated }: HeroProps) {
  return (
    <section id="top" className="relative mx-auto grid max-w-7xl items-center gap-12 lg:gap-14 px-5 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-20">
      <div>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-4 text-xs font-semibold uppercase tracking-[.2em] text-emerald-700"
        >
          Property maintenance, without the chaos
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl text-4xl sm:text-5xl lg:text-[62px] font-semibold tracking-[-.055em] text-[#073b3a] leading-[1.05]"
        >
          Maintenance, managed in one place.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-slate-600"
        >
          Bring tenant requests, vendor coordination, and property updates together in one simple workspace. Spend less time chasing updates and more time managing your properties.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
            <Button className="h-11 rounded-lg bg-[#073b3a] px-5 text-white hover:bg-[#0a504d] font-semibold text-sm gap-2 shadow-sm transition-all hover:-translate-y-0.5">
              <span>{isAuthenticated ? "Go to Workspace" : "Start 7-Day Free Trial"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <a href="#interactive-demo">
            <Button
              variant="outline"
              className="h-11 rounded-lg border-slate-300 bg-transparent px-5 text-[#073b3a] hover:bg-[#eef5f1] font-medium text-sm gap-2 transition-all"
            >
              <Play className="size-3.5 text-emerald-700 fill-emerald-700" />
              <span>Explore Live Triage Demo</span>
            </Button>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-5 text-xs text-slate-500 font-medium flex items-center gap-2"
        >
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <span>Built for property managers (50–500 units) • Enterprise tenant isolation • No credit card required</span>
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <AutonomousDispatchConsole />
      </motion.div>
    </section>
  );
}
