"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full border-t border-[#dfe8e3] bg-white text-slate-600 font-sans">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2 pr-0 lg:pr-8">
            <Link href="/" className="inline-block" aria-label="Orqanta Home">
              <Image
                src="/orqanta-logo.png"
                alt="Orqanta — Properties. People. Progress."
                width={160}
                height={68}
                className="h-auto w-[150px] object-contain object-left"
              />
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              The autonomous maintenance operations workspace for modern property managers.
              Instant triage, vetted vendor dispatch, and real-time tenant transparency.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium bg-[#eef5f1] px-3 py-1.5 rounded-md border border-[#cbdad3] w-fit">
              <span className="size-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>All Systems Operational • Bank-Grade Isolation</span>
            </div>

            {/* Social Media Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter/X"
                className="size-8 rounded-lg border border-[#dfe8e3] bg-[#fbfcfa] flex items-center justify-center text-slate-600 hover:text-[#073b3a] hover:border-[#073b3a]/30 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="size-8 rounded-lg border border-[#dfe8e3] bg-[#fbfcfa] flex items-center justify-center text-slate-600 hover:text-[#073b3a] hover:border-[#073b3a]/30 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
                </svg>
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="size-8 rounded-lg border border-[#dfe8e3] bg-[#fbfcfa] flex items-center justify-center text-slate-600 hover:text-[#073b3a] hover:border-[#073b3a]/30 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.300 24 12c0-6.627-5.374-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#073b3a]">
              Product
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <a href="#features" className="hover:text-[#073b3a] transition-colors">
                  Overview & Features
                </a>
              </li>
              <li>
                <a href="#interactive-demo" className="hover:text-[#073b3a] transition-colors">
                  AI Triage Simulator
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-[#073b3a] transition-colors">
                  Contractor Matching
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-[#073b3a] transition-colors font-medium text-emerald-800">
                  Pricing (₹199/mo)
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div className="space-y-3 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#073b3a]">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li>
                <span className="text-slate-800 font-medium">Property Managers</span>
                <p className="text-[11px] text-slate-500">Autonomous job dispatch & tracking</p>
              </li>
              <li>
                <span className="text-slate-800 font-medium">Tenants</span>
                <p className="text-[11px] text-slate-500">QR code & photo ticketing</p>
              </li>
              <li>
                <span className="text-slate-800 font-medium">Vendors</span>
                <p className="text-[11px] text-slate-500">Clear work orders & fast updates</p>
              </li>
            </ul>
          </div>

          {/* Operations & Security Column */}
          <div className="space-y-3 text-sm">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#073b3a]">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <ShieldCheck className="size-3.5 text-emerald-700 shrink-0" />
                <span>Bank-Grade Data Encryption</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="size-3.5 text-emerald-700 shrink-0" />
                <span>Tenant-Isolated Privacy</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="size-3.5 text-emerald-700 shrink-0" />
                <span>Automated Vendor Dispatch</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-700">
                <CheckCircle2 className="size-3.5 text-emerald-700 shrink-0" />
                <span>99.9% Uptime Guarantee</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Signature Architectural Diagonal Pattern Band */}
      <div className="w-full h-11 relative overflow-hidden border-t border-b border-[#dfe8e3] bg-[#f7fbf8]">
        <div className="absolute inset-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="w-full h-full relative">
            {Array.from({ length: 150 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-[300px] h-12 border border-[#073b3a]/15"
                style={{
                  left: `${i * 300 - 600}px`,
                  top: "-120px",
                  transform: "rotate(-45deg)",
                  transformOrigin: "top left",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Orqanta. Properties. People. Progress.</p>
        <div className="flex items-center gap-6">
          <span className="hover:text-slate-800 transition-colors cursor-pointer">
            Privacy Policy
          </span>
          <span className="hover:text-slate-800 transition-colors cursor-pointer">
            Terms of Service
          </span>
          <span className="hover:text-slate-800 transition-colors cursor-pointer">
            Cookie Preferences
          </span>
        </div>
      </div>
    </footer>
  );
}
