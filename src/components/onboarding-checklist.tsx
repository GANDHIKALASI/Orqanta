import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight, Sparkles, Building2, Users, KeyRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OnboardingChecklistProps {
  propertyCount: number;
  vendorCount: number;
  tenantCount: number;
}

export function OnboardingChecklist({
  propertyCount,
  vendorCount,
  tenantCount,
}: OnboardingChecklistProps) {
  const steps = [
    {
      title: "Add your first property",
      description: "Register a building or multi-unit address to begin receiving tickets.",
      href: "/properties",
      icon: Building2,
      done: propertyCount > 0,
      actionText: "Add Property",
    },
    {
      title: "Add a contractor or vendor",
      description: "Build your directory of plumbers, electricians, and handymen for AI dispatch.",
      href: "/vendors",
      icon: Users,
      done: vendorCount > 0,
      actionText: "Add Vendor",
    },
    {
      title: "Invite your first tenant",
      description: "Send a portal invite link to a tenant with their assigned unit number.",
      href: "/tenants",
      icon: KeyRound,
      done: tenantCount > 0,
      actionText: "Invite Tenant",
    },
  ];

  const completedCount = steps.filter((s) => s.done).length;
  const isAllDone = completedCount === 3;

  if (isAllDone) {
    return null;
  }

  const progressPercent = Math.round((completedCount / 3) * 100);

  return (
    <Card className="border border-emerald-200/80 bg-gradient-to-r from-[#eef5f1]/80 to-white shadow-sm overflow-hidden">
      <CardContent className="p-5 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-[#073b3a] text-white flex items-center justify-center shrink-0">
              <Sparkles className="size-4 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-semibold text-[#073b3a] text-base">
                Welcome to Orqanta — Workspace Setup
              </h3>
              <p className="text-xs text-slate-600">
                Complete these 3 foundational steps to fully activate your maintenance desk.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-semibold text-emerald-800">
              {completedCount} of 3 complete
            </span>
            <div className="w-24 h-2 rounded-full bg-emerald-100 overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {steps.map((step, idx) => {
            return (
              <Link
                key={step.title}
                href={step.href}
                className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between gap-3 group cursor-pointer hover:shadow-sm hover:-translate-y-0.5 ${
                  step.done
                    ? "bg-white/90 border-emerald-200 hover:border-emerald-400"
                    : "bg-white border-[#dfe8e3] hover:border-emerald-600/50"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Step {idx + 1}
                    </span>
                    {step.done ? (
                      <CheckCircle2 className="size-4 text-emerald-600" />
                    ) : (
                      <Circle className="size-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
                    )}
                  </div>
                  <h4 className="font-semibold text-[#073b3a] text-sm group-hover:text-emerald-700 transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#dfe8e3]/40">
                  {step.done ? (
                    <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1 group-hover:underline">
                      <span>Completed</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1 group-hover:underline">
                      <span>{step.actionText}</span>
                      <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
