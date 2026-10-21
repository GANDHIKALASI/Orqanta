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
    <Card className="border border-violet-200 dark:border-violet-900/50 bg-gradient-to-r from-violet-50/70 to-white dark:from-violet-950/20 dark:to-zinc-900 shadow-sm overflow-hidden">
      <CardContent className="p-5 md:p-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">
                Welcome to Orqanta — Workspace Setup
              </h3>
              <p className="text-xs text-zinc-500">
                Complete these 3 foundational steps to fully activate your AI maintenance desk.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">
              {completedCount} of 3 complete
            </span>
            <div className="w-24 h-2 rounded-full bg-violet-200 dark:bg-violet-950 overflow-hidden">
              <div
                className="h-full bg-violet-600 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between gap-3 ${
                  step.done
                    ? "bg-white/80 dark:bg-zinc-900/80 border-emerald-200 dark:border-emerald-950"
                    : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-violet-300"
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                      Step {idx + 1}
                    </span>
                    {step.done ? (
                      <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle className="size-4 text-zinc-300 dark:text-zinc-600" />
                    )}
                  </div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                    {step.title}
                  </h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div>
                  {step.done ? (
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                      Completed
                    </span>
                  ) : (
                    <Link href={step.href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto text-xs font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-800 inline-flex items-center gap-1"
                      >
                        {step.actionText}
                        <ArrowRight className="size-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
