"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  isAuthenticated: boolean;
}

function DashboardPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(4,38,38,0.12)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-800">Maintenance overview</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">Live operational preview</span>
      </div>
      <div className="grid grid-cols-3 gap-3 border-b border-slate-100 p-4">
        <div className="rounded-lg bg-[#f2f8f6] p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Open work orders</p>
          <p className="mt-1 text-2xl font-bold text-[#073b3a]">24</p>
          <span className="text-[10px] text-emerald-700 font-medium">+4 this week</span>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">In progress</p>
          <p className="mt-1 text-2xl font-bold text-[#073b3a]">11</p>
          <span className="text-[10px] text-slate-500">8 vendors assigned</span>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Awaiting review</p>
          <p className="mt-1 text-2xl font-bold text-[#073b3a]">06</p>
          <span className="text-[10px] text-slate-500">Needs manager attention</span>
        </div>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[1.2fr_.8fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-800">Recent work orders</p>
            <span className="text-[10px] text-emerald-700 font-medium">Orqanta AI triaged</span>
          </div>
          <div className="flex flex-col gap-2">
            {[
              ["Leaking kitchen faucet", "Oakview Apartments · Unit 204", "High", "bg-rose-50 text-rose-700 border border-rose-200/60"],
              ["Hallway light replacement", "Maple Court · Common area", "Normal", "bg-amber-50 text-amber-700 border border-amber-200/60"],
              ["HVAC making unusual noise", "Riverside Homes · Unit 12", "Low", "bg-emerald-50 text-emerald-700 border border-emerald-200/60"],
            ].map(([title, sub, priority, color]) => (
              <div key={title} className="flex items-center justify-between rounded-lg border border-slate-100 p-2.5 bg-[#fbfcfa]">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold text-slate-800">{title}</p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-500">{sub}</p>
                </div>
                <span className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium ${color}`}>
                  {priority}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg bg-[#073b3a] p-4 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-200">
              <Sparkles className="size-3.5 text-emerald-300" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Orqanta Assist</span>
            </div>
            <p className="mt-2.5 text-xs font-medium leading-5 text-emerald-50">
              Three requests relate to a recurring plumbing riser issue at Oakview.
            </p>
            <p className="mt-2 text-[10px] leading-4 text-emerald-100/70">
              Suggested priority: review with building maintenance plumbing partner.
            </p>
          </div>
          <a
            href="#interactive-demo"
            className="mt-3 text-[10px] font-medium text-emerald-300 hover:text-white underline underline-offset-4 flex items-center gap-1"
          >
            Launch live triage simulator &rarr;
          </a>
        </div>
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
            <Button className="h-11 rounded-md bg-[#073b3a] px-5 text-white hover:bg-[#0a504d] font-semibold text-sm gap-2 shadow-sm">
              <span>{isAuthenticated ? "Launch Dashboard" : "Start 7-Day Free Trial"}</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>

          <a href="#interactive-demo">
            <Button
              variant="outline"
              className="h-11 rounded-md border-slate-300 bg-transparent px-5 text-[#073b3a] hover:bg-[#eef5f1] font-medium text-sm gap-2"
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
          className="mt-5 text-xs text-slate-500 font-medium"
        >
          Built for property managers (50–500 units) • Enterprise tenant isolation • No credit card required
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
      >
        <DashboardPreview />
      </motion.div>
    </section>
  );
}
