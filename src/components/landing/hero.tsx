"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  isAuthenticated: boolean;
}

export function LandingHero({ isAuthenticated }: HeroProps) {
  return (
    <section id="top" className="relative mx-auto max-w-5xl px-5 pb-20 pt-16 sm:pb-28 sm:pt-24 text-center">
      {/* Category Tag */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 text-xs sm:text-sm font-semibold uppercase tracking-[.25em] text-emerald-800"
      >
        Property Maintenance • Autonomous Operations
      </motion.p>

      {/* Main SaaS Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#073b3a] leading-[1.08] max-w-4xl mx-auto"
      >
        Maintenance, managed in one place.
      </motion.h1>

      {/* Direct SaaS Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 max-w-2xl mx-auto text-base sm:text-xl leading-relaxed text-slate-600 font-normal"
      >
        Bring tenant requests, automated AI triage, contractor dispatch, and portfolio tracking together into one seamless operating system. Spend less time chasing updates and more time managing your properties.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5"
      >
        <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-12 px-7 rounded-xl bg-[#073b3a] text-white hover:bg-[#0a504d] font-semibold text-sm gap-2 shadow-sm transition-all hover:-translate-y-0.5">
            <span>{isAuthenticated ? "Enter Workspace" : "Start 7-Day Free Trial"}</span>
            <ArrowRight className="size-4" />
          </Button>
        </Link>

        <a href="#interactive-demo" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-12 px-6 rounded-xl border-[#dfe8e3] bg-white text-[#073b3a] hover:bg-[#f2f8f6] font-semibold text-sm gap-2 transition-all"
          >
            <Play className="size-3.5 text-emerald-700 fill-emerald-700" />
            <span>Explore Live Triage Demo</span>
          </Button>
        </a>
      </motion.div>

      {/* Direct SaaS Trust Line — No boxes, clean text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 pt-8 border-t border-[#dfe8e3]/80 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium"
      >
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <span>Built for property managers (50–500 units)</span>
        </div>
        <span className="hidden sm:inline text-slate-300">•</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <span>70% faster vendor dispatch</span>
        </div>
        <span className="hidden sm:inline text-slate-300">•</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <span>Enterprise Row-Level Security</span>
        </div>
        <span className="hidden sm:inline text-slate-300">•</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
          <span>No credit card required</span>
        </div>
      </motion.div>
    </section>
  );
}
