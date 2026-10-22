"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  isAuthenticated: boolean;
}

export function LandingCtaBanner({ isAuthenticated }: CtaBannerProps) {
  return (
    <section className="py-20 sm:py-24 bg-[#fbfcfa] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#073b3a] to-[#042626] px-6 py-14 sm:py-20 sm:px-16 text-center text-white shadow-2xl shadow-[#073b3a]/25 border border-emerald-900/40">
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Glowing Top Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide mb-6 backdrop-blur-md">
            <Sparkles className="size-3.5 text-emerald-400 animate-pulse" />
            <span>Ready For Immediate Deployment</span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.12]">
            Transform Your Maintenance Operations Today
          </h2>

          <p className="mt-5 text-base sm:text-lg text-emerald-100/85 max-w-2xl mx-auto font-normal leading-relaxed">
            Join property managers saving 15+ hours every week with autonomous AI ticket triage, instant contractor dispatch, and automated resident communications.
          </p>

          {/* Value Highlights Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs text-emerald-200/90 font-medium">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              7-Day Unrestricted Free Trial
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <Zap className="size-3.5 text-emerald-400" />
              Setup in &lt; 2 Minutes
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
              <ShieldCheck className="size-3.5 text-emerald-400" />
              No Credit Card Required
            </span>
          </div>

          {/* CTA Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href={isAuthenticated ? "/dashboard" : "/signup"} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto h-12 px-8 bg-white hover:bg-emerald-50 text-[#073b3a] font-bold text-sm shadow-lg shadow-black/10 gap-2 transition-all duration-200 hover:-translate-y-0.5 rounded-xl"
              >
                <span>{isAuthenticated ? "Go to Workspace" : "Start 7-Day Free Trial"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            {!isAuthenticated ? (
              <Link href="/login" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-7 border-emerald-700/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-100 font-semibold text-sm transition-all rounded-xl"
                >
                  Sign In to Workspace
                </Button>
              </Link>
            ) : (
              <a href="#interactive-demo" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-7 border-emerald-700/60 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-100 font-semibold text-sm transition-all rounded-xl"
                >
                  Explore AI Simulator
                </Button>
              </a>
            )}
          </div>

          {/* Subtext */}
          <p className="mt-8 text-xs text-emerald-300/60 font-medium">
            Cancel anytime • Enterprise Row-Level Security (RLS) • Immediate activation
          </p>
        </div>
      </div>
    </section>
  );
}
