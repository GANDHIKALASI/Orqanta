"use client";

import * as React from "react";

export function LandingSolutions() {
  return (
    <section className="bg-[#eef5f1] border-y border-[#dfe8e3]" id="solutions">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[.2em] text-emerald-700">
            Built for every stakeholder
          </p>
          <h2 className="mt-4 text-3xl sm:text-5xl font-semibold tracking-[-.04em] text-[#073b3a]">
            One workflow. Everyone on the same page.
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Maintenance works best when every participant stays informed without back-and-forth phone tag.
          </p>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
            <div key={title} className="border-l-2 border-emerald-700/40 pl-5">
              <h3 className="font-semibold text-base text-[#073b3a]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
