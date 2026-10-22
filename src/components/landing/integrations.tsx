"use client";

import * as React from "react";
import { Wrench, ArrowRight, QrCode, Globe, Shield } from "lucide-react";

export function LandingIntegrations() {
  return (
    <section id="integrations" className="border-y border-[#dfe8e3] bg-white">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">
            Embedded requests and integrations
          </p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-[-.04em] text-[#073b3a]">
            Maintenance requests, wherever your tenants are.
          </h2>
          <p className="mt-5 text-base sm:text-lg leading-8 text-slate-600">
            Embed an instant request widget into your existing website or place branded QR stickers in building lobbies so residents report issues immediately with zero friction.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-3 sm:gap-4 rounded-xl border border-dashed border-emerald-700/40 bg-[#f7fbf8] p-6 sm:p-7 text-sm text-slate-700">
          <div className="size-9 rounded-lg bg-[#eef5f1] border border-[#cbdad3] flex items-center justify-center text-emerald-700">
            <QrCode className="size-4.5" />
          </div>
          <span className="font-semibold text-[#073b3a]">Building QR Code / Resident Widget</span>
          <ArrowRight className="size-4 text-emerald-600" />
          <div className="size-9 rounded-lg bg-[#eef5f1] border border-[#cbdad3] flex items-center justify-center text-emerald-700">
            <Globe className="size-4.5" />
          </div>
          <span className="font-semibold text-[#073b3a]">Your Website or Resident Portal</span>
          <ArrowRight className="size-4 text-emerald-600" />
          <div className="size-9 rounded-lg bg-[#073b3a] text-white flex items-center justify-center shadow-sm">
            <Shield className="size-4.5 text-emerald-300" />
          </div>
          <span className="font-semibold text-emerald-800">Orqanta Autonomous AI Workspace</span>
        </div>
      </div>
    </section>
  );
}
