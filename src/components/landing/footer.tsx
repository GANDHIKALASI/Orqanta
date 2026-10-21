"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo-icon.png"
                alt="Orqanta"
                width={30}
                height={30}
                className="size-7 object-contain"
              />
              <span className="text-lg font-bold text-white tracking-tight">Orqanta</span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed font-sans">
              AI-native, multi-tenant property maintenance platform for modern real estate portfolios.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider block">
              Product
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#features" className="hover:text-white transition-colors">
                  AI Triage Engine
                </a>
              </li>
              <li>
                <a href="#interactive-demo" className="hover:text-white transition-colors">
                  Interactive Simulator
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  Contractor Routing
                </a>
              </li>
              <li>
                <a href="#roi" className="hover:text-white transition-colors">
                  ROI Comparison
                </a>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider block">
              Workspace
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Executive Dashboard
                </Link>
              </li>
              <li>
                <Link href="/work-orders" className="hover:text-white transition-colors">
                  Work Order Roster
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-white transition-colors">
                  Properties Portfolio
                </Link>
              </li>
              <li>
                <Link href="/vendors" className="hover:text-white transition-colors">
                  Contractor Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Architecture */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider block">
              Security & Stack
            </span>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-zinc-400">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>Supabase Row-Level Security</span>
              </li>
              <li>Google Gemini 3.8 Flash</li>
              <li>Next.js 14 App Router</li>
              <li>Resend Transactional Email</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Orqanta. Properties. People. Progress.</p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-zinc-300 transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="hover:text-zinc-300 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
