"use client";

import * as React from "react";

export function LandingSolutions() {
  return (
    <section className="bg-[#eef5f1] border-y border-[#dfe8e3]" id="solutions">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:py-16 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">
            Built for every stakeholder
          </p>
          <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#073b3a]">
            One workflow. Everyone on the same page.
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Maintenance works best when every participant stays informed without back-and-forth phone tag.
          </p>
        </div>
        <div className="mt-8 sm:mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [
              "Property managers",
              "A central command center for requests, contractor assignments, and real-time resolution progress.",
            ],
            [
              "Residents & Tenants",
              "A frictionless way to report issues, attach damage photos, and receive automated status updates.",
            ],
            [
              "Contractors & Vendors",
              "Clear job specifications, unit access details, and direct assignment without lost emails.",
            ],
            [
              "Property Owners",
              "Complete visibility into portfolio capital preservation, recurring appliance failures, and monthly cost trends.",
            ],
          ].map(([title, text]) => (
            <div key={title} className="border-l-2 border-emerald-700/40 pl-4">
              <h3 className="font-semibold text-sm sm:text-base text-[#073b3a]">{title}</h3>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
