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
    <section id="top" className="relative mx-auto max-w-4xl px-5 pt-8 pb-10 sm:pt-12 sm:pb-12 text-center">
      {/* Category Tag */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-2.5 text-xs font-semibold uppercase tracking-[.2em] text-emerald-800"
      >
        Property Maintenance • Autonomous Operations
      </motion.p>

      {/* Main SaaS Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#073b3a] leading-[1.12] max-w-3xl mx-auto"
      >
        Maintenance, managed in one place.
      </motion.h1>

      {/* Direct SaaS Description */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-3.5 max-w-2xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed text-slate-600 font-normal"
      >
        Bring tenant requests, automated AI triage, contractor dispatch, and portfolio tracking together into one seamless operating system. Spend less time chasing updates and more time managing your properties.
      </motion.p>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center gap-3"
      >
        <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto h-11 px-6 rounded-lg bg-[#073b3a] text-white hover:bg-[#0a504d] font-semibold text-xs sm:text-sm gap-2 shadow-sm transition-all hover:-translate-y-0.5">
            <span>{isAuthenticated ? "Enter Workspace" : "Start 7-Day Free Trial"}</span>
            <ArrowRight className="size-4" />
          </Button>
        </Link>

        <a href="#interactive-demo" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="w-full sm:w-auto h-11 px-5 rounded-lg border-[#dfe8e3] bg-white text-[#073b3a] hover:bg-[#f2f8f6] font-semibold text-xs sm:text-sm gap-2 transition-all"
          >
            <Play className="size-3.5 text-emerald-700 fill-emerald-700" />
            <span>Explore Live Triage Demo</span>
          </Button>
        </a>
      </motion.div>

      {/* Direct SaaS Trust Line — Compact, cohesive, no extra boxes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-8 pt-5 sm:mt-9 sm:pt-6 border-t border-[#dfe8e3]/80 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs text-slate-500 font-medium"
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
