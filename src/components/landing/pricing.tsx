"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LandingPricingProps {
  isAuthenticated: boolean;
}

export function LandingPricing({ isAuthenticated }: LandingPricingProps) {
  return (
    <section id="pricing" className="py-14 sm:py-16 bg-[#fbfcfa] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700 mb-2">
            Simple, Transparent Pricing
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#073b3a]">
            Choose the Plan That Fits Your Properties
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Start with our 7-day unrestricted free trial. No credit card required. Upgrade when you are ready.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border border-slate-200/90 bg-white p-8 flex flex-col justify-between shadow-sm hover:border-emerald-600/40 hover:shadow-md transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Standard Monthly
                  </span>
                  <h3 className="text-2xl font-semibold text-[#073b3a] mt-1">Monthly Plan</h3>
                </div>
                <Badge variant="outline" className="border-slate-200 text-slate-600 bg-slate-50 text-xs">
                  Pay as you go
                </Badge>
              </div>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-[#073b3a]">
                  ₹199
                </span>
                <span className="text-sm font-medium text-slate-500">/ month</span>
              </div>
              <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                Full AI maintenance operations engine for independent managers and growing landlords.
              </p>

              <div className="mt-8 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Included Features:
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
                  {[
                    "Orqanta AI Autonomous Work Order Triage (< 3s)",
                    "Automatic 8-Trade Classification & Urgency Ranking",
                    "Resident QR Code & Frictionless Web Ticketing",
                    "Automated Contractor Match & Dispatch Suggestions",
                    "Pre-Drafted Tenant SMS & Email Notifications",
                    "Unlimited Properties, Buildings, and Units",
                    "Standard Operations Support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <Check className="size-4 text-emerald-600 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link href={isAuthenticated ? "/billing" : "/signup"} className="block w-full">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 bg-white hover:bg-[#eef5f1] text-[#073b3a] border-slate-300 font-semibold text-sm gap-2 transition-all"
                >
                  <span>{isAuthenticated ? "Choose Monthly" : "Start 7-Day Free Trial"}</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <p className="text-[11px] text-center text-slate-500 mt-2">
                Billed monthly. Cancel anytime with 1-click.
              </p>
            </div>
          </motion.div>

          {/* Annual Pro Plan (Featured Forest Green) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-xl border border-[#073b3a] bg-[#073b3a] text-white p-8 flex flex-col justify-between shadow-xl shadow-[#073b3a]/15 hover:shadow-2xl transition-all duration-300"
          >
            <div className="absolute -top-3.5 right-6">
              <Badge className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-1 tracking-wider uppercase shadow-md flex items-center gap-1.5 border-0">
                <Sparkles className="size-3.5" /> Best Value • 2 Months Free
              </Badge>
            </div>

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    Annual Pro
                  </span>
                  <h3 className="text-2xl font-semibold text-white mt-1">Yearly Plan</h3>
                </div>
                <span className="text-xs font-semibold text-emerald-300 bg-white/10 px-2.5 py-1 rounded-md border border-white/20">
                  Save 16%
                </span>
              </div>

              <div className="mt-6 flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
                  ₹1,999
                </span>
                <span className="text-sm font-normal text-emerald-100/70">/ year</span>
              </div>
              <p className="mt-2 text-xs text-emerald-100/80 leading-relaxed">
                Save ₹389 annually (just ₹166/month). The highest performance setup for professional teams.
              </p>

              <div className="mt-8 space-y-3">
                <div className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                  Everything in Monthly, Plus:
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-emerald-50">
                  {[
                    "Orqanta AI Instant Emergency Hazard Prioritization",
                    "Automated Monthly Portfolio Diagnostic Reports",
                    "Chronic Appliance & Duplicate Ticket Detection",
                    "Unlimited Staff Accounts & Role Permissions",
                    "Multi-Property Bulk Data Export & Insights",
                    "Contractor Insurance Verification Warning System",
                    "Priority 24/7 Operations Support",
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <Check className="size-4 text-emerald-400 shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link href={isAuthenticated ? "/billing" : "/signup"} className="block w-full">
                <Button
                  size="lg"
                  className="w-full h-12 bg-white hover:bg-emerald-50 text-[#073b3a] font-semibold text-sm shadow-md gap-2 transition-all hover:scale-[1.01]"
                >
                  <span>{isAuthenticated ? "Upgrade to Annual Pro" : "Start 7-Day Free Trial"}</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <p className="text-[11px] text-center text-emerald-100/70 mt-2">
                ₹1,999 billed annually. 30-day money-back guarantee.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Value Highlights Strip */}
        <div className="mt-14 pt-8 border-t border-[#dfe8e3] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-1.5">
            <div className="size-9 rounded-lg bg-[#eef5f1] text-emerald-700 flex items-center justify-center">
              <Zap className="size-4.5" />
            </div>
            <h4 className="text-sm font-semibold text-[#073b3a]">Instant Deployment</h4>
            <p className="text-xs text-slate-600">Launch in under 2 minutes with no engineering required.</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="size-9 rounded-lg bg-[#eef5f1] text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="size-4.5" />
            </div>
            <h4 className="text-sm font-semibold text-[#073b3a]">No Per-Door Penalties</h4>
            <p className="text-xs text-slate-600">Fixed rate pricing regardless of how many units you manage.</p>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="size-9 rounded-lg bg-[#eef5f1] text-emerald-700 flex items-center justify-center">
              <Sparkles className="size-4.5" />
            </div>
            <h4 className="text-sm font-semibold text-[#073b3a]">7-Day Free Trial</h4>
            <p className="text-xs text-slate-600">Explore full features with your live portfolio at zero risk.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
