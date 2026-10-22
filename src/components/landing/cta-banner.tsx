"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  isAuthenticated: boolean;
}

export function LandingCtaBanner({ isAuthenticated }: CtaBannerProps) {
  return (
    <section className="py-20 bg-[#fbfcfa] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-2xl overflow-hidden bg-[#073b3a] px-6 py-14 sm:py-16 sm:px-12 text-center text-white shadow-xl shadow-[#073b3a]/15">
          {/* Logo Mark or Icon */}
          <div className="relative mx-auto size-14 mb-4">
            <Image
              src="/orqanta-logo.png"
              alt="Orqanta Emblem"
              width={140}
              height={50}
              className="h-10 w-auto object-contain mx-auto filter brightness-0 invert"
            />
          </div>

          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-300 mb-2">
            Ready for Immediate Deployment
          </p>

          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-.04em] text-white max-w-2xl mx-auto leading-tight">
            Transform Your Maintenance Operations Today
          </h2>

          <p className="mt-4 text-base sm:text-lg text-emerald-100/80 max-w-xl mx-auto font-normal">
            Join property managers saving 15+ hours weekly with autonomous Orqanta AI triage and vetted vendor routing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button
                size="lg"
                className="h-12 px-8 bg-white hover:bg-emerald-50 text-[#073b3a] font-semibold text-sm shadow-md gap-2 transition-all duration-200"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Start 7-Day Free Trial"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            {!isAuthenticated && (
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 border-white/30 bg-transparent hover:bg-white/10 text-white font-medium text-sm transition-all"
                >
                  Sign In to Workspace
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-8 text-xs text-emerald-200/60">
            7-day unrestricted free trial • Instant setup in &lt; 2 minutes • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}

