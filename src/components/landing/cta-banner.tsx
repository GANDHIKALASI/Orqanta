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
    <section className="py-20 bg-zinc-950 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl overflow-hidden border border-violet-500/30 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 p-8 sm:p-14 text-center shadow-[0_0_100px_rgba(139,92,246,0.18)]">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-gradient-to-r from-blue-600/30 via-indigo-600/25 to-violet-600/30 blur-[100px] pointer-events-none rounded-full" />

          {/* Logo Mark */}
          <div className="relative mx-auto size-16 mb-6 drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            <Image
              src="/logo-icon.png"
              alt="Orqanta Emblem"
              width={64}
              height={64}
              className="size-16 object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5 text-violet-400" />
            <span>Ready for Immediate Deployment</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
            Transform Your Maintenance Operations Today
          </h2>

          <p className="mt-4 text-base sm:text-lg text-zinc-300 max-w-xl mx-auto font-normal">
            Join hundreds of property managers saving 15+ hours weekly with autonomous Orqanta AI triage and vetted vendor routing.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={isAuthenticated ? "/dashboard" : "/signup"}>
              <Button
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold text-base shadow-xl shadow-blue-500/25 border border-white/20 gap-2 transition-all duration-300 hover:scale-[1.03]"
              >
                <span>{isAuthenticated ? "Go to Dashboard" : "Start 14-Day Free Trial"}</span>
                <ArrowRight className="size-4" />
              </Button>
            </Link>

            {!isAuthenticated && (
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-7 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 border-zinc-700/80 font-medium text-base backdrop-blur-md"
                >
                  Sign In to Workspace
                </Button>
              </Link>
            )}
          </div>

          <div className="mt-8 text-xs text-zinc-400">
            No credit card required • Instant setup in &lt; 2 minutes • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
}
