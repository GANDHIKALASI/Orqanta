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
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-zinc-950 text-white">
      {/* Background Radial Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-blue-600/25 via-indigo-600/20 to-violet-600/30 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-cyan-500/15 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-purple-600/15 blur-[110px] rounded-full pointer-events-none" />

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Release Tag */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-violet-500/30 text-violet-300 text-xs sm:text-sm font-medium shadow-lg shadow-violet-500/10 mb-6 backdrop-blur-md"
          >
            <Sparkles className="size-3.5 text-violet-400 animate-pulse" />
            <span>AI-Native Maintenance Architecture</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-zinc-400 text-xs hidden sm:inline">Powered by Gemini 3.8</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12]"
          >
            Maintenance operations that{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]">
              triage, dispatch, & resolve
            </span>{" "}
            autonomously.
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-zinc-300 max-w-2xl font-normal leading-relaxed"
          >
            Stop drowning in late-night tenant texts and emergency contractor scramble. Orqanta gives property managers (50–500 units) an automated command center with instant trade categorization and tenant isolation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href={isAuthenticated ? "/dashboard" : "/signup"}
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold text-base shadow-xl shadow-blue-500/30 border border-white/20 gap-2.5 transition-all duration-300 hover:scale-[1.03]"
              >
                <span>{isAuthenticated ? "Launch Dashboard" : "Start 14-Day Free Trial"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            <a href="#interactive-demo" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-12 px-7 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80 font-medium text-base gap-2 backdrop-blur-md hover:border-zinc-500 transition-all"
              >
                <Play className="size-4 text-violet-400 fill-violet-400" />
                <span>Live Interactive Demo</span>
              </Button>
            </a>
          </motion.div>

          {/* Social Proof / Security Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-zinc-400 font-medium"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>Supabase Tenant-Isolated RLS</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="size-4 text-amber-400" />
              <span>&lt; 3.2s Gemini AI Triage</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-blue-400" />
              <span>No Credit Card Required</span>
            </div>
          </motion.div>
        </div>

        {/* Floating Perspective SaaS Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 sm:mt-18 relative mx-auto max-w-5xl rounded-2xl border border-zinc-700/70 bg-gradient-to-b from-zinc-900/95 via-zinc-900/80 to-zinc-950 p-2 sm:p-4 shadow-[0_0_80px_rgba(59,130,246,0.18)] backdrop-blur-xl"
        >
          {/* Top Mockup Header Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/80 mb-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-[11px] text-zinc-500 ml-2">
                app.orqanta.com/work-orders/live-triage
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Realtime Triage Active
            </div>
          </div>

          {/* Inner Simulated App Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-2 sm:p-4 bg-zinc-950/70 rounded-xl border border-zinc-800/60">
            {/* Left simulated sidebar mini */}
            <div className="hidden lg:flex lg:col-span-3 flex-col justify-between p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 text-xs">
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
                  <Image
                    src="/logo-icon.png"
                    alt="Logo"
                    width={22}
                    height={22}
                    className="size-5"
                  />
                  <span className="font-semibold text-white">Grand Oak Portfolio</span>
                </div>
                <div className="space-y-1 text-zinc-400">
                  <div className="px-2 py-1.5 rounded bg-zinc-800 text-white font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Wrench className="size-3.5 text-violet-400" />
                      Live Tickets
                    </span>
                    <span className="text-[10px] bg-violet-500/30 text-violet-300 px-1.5 rounded">
                      4
                    </span>
                  </div>
                  <div className="px-2 py-1.5 hover:text-white flex items-center gap-2">
                    <Clock className="size-3.5" />
                    Dispatch Queue
                  </div>
                  <div className="px-2 py-1.5 hover:text-white flex items-center gap-2">
                    <ShieldCheck className="size-3.5" />
                    Vendor Compliance
                  </div>
                </div>
              </div>
              <div className="pt-2 text-[10px] text-zinc-500 border-t border-zinc-800 flex items-center justify-between">
                <span>Org ID: 8812</span>
                <span className="text-emerald-400">RLS Isolated</span>
              </div>
            </div>

            {/* Main Ticket Highlight Preview */}
            <div className="col-span-1 md:col-span-12 lg:col-span-9 space-y-3">
              {/* Highlight Ticket Card */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-800">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs text-zinc-400 font-semibold">
                      #WO-4029
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-700/50 flex items-center gap-1">
                      <AlertTriangle className="size-3" />
                      Urgent Emergency
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-950/80 text-blue-300 border border-blue-800/50">
                      Plumbing
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500">2 minutes ago</span>
                </div>

                <div className="mt-3">
                  <h4 className="text-base font-semibold text-white">
                    Main water pipe leaking into hallway ceiling
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1">
                    Grand Oak Apartments • Unit 304 (Damage observed directly below Unit 404 riser)
                  </p>
                </div>

                {/* AI Intelligence Drawer Box */}
                <div className="mt-4 p-3.5 rounded-lg bg-gradient-to-r from-violet-950/40 to-indigo-950/30 border border-violet-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-violet-400" />
                      <span className="text-xs font-semibold text-violet-200">
                        Gemini AI Autonomous Triage
                      </span>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                      99.6% Trade Confidence
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Identified high-velocity water ingress risking electrical junction box. Immediate shutoff valve isolation recommended.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                    <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                      <span className="text-zinc-400">Assigned Contractor:</span>
                      <span className="text-white font-medium">Apex Emergency Plumbing</span>
                    </div>
                    <div className="p-2 rounded bg-zinc-900/80 border border-zinc-800 flex items-center justify-between">
                      <span className="text-zinc-400">Insurance Status:</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
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
