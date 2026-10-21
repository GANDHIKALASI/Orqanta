"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wrench,
  Send,
  Loader2,
  ShieldCheck,
  User,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Scenario {
  id: string;
  label: string;
  property: string;
  unit: string;
  issue: string;
  detectedTrade: string;
  confidence: number;
  priority: "urgent" | "high" | "medium";
  matchedVendor: {
    name: string;
    phone: string;
    rating: string;
    insurance: string;
  };
  aiInsight: string;
  autoDraftReply: string;
}

const scenarios: Scenario[] = [
  {
    id: "water-leak",
    label: "Water Leak Emergency",
    property: "Grand Oak Residences",
    unit: "Unit 402",
    issue: "Water supply line under the kitchen sink burst 10 minutes ago. Water is flowing into the hallway and dripping through the ceiling of Unit 302 below.",
    detectedTrade: "Plumbing",
    confidence: 99.4,
    priority: "urgent",
    matchedVendor: {
      name: "Apex 24/7 Emergency Plumbing",
      phone: "+1 (512) 890-2190",
      rating: "4.9 ★ (140+ jobs)",
      insurance: "Expires Nov 2027 • Verified",
    },
    aiInsight:
      "Catastrophic water flow detected with structural seepage risk to lower floor. Immediate sub-meter shutoff recommended prior to contractor arrival.",
    autoDraftReply:
      "Hi Alex, our emergency triage has flagged your leak as URGENT. Apex Plumbing has been notified for emergency dispatch. Please shut off the valve beneath the sink clockwise if accessible. A technician is en route.",
  },
  {
    id: "hvac-heatwave",
    label: "HVAC Failure in Heatwave",
    property: "Harbor View Towers",
    unit: "Unit 714",
    issue: "The rooftop heat pump stopped blowing cold air this morning. Indoor thermostat shows 86°F and climbing, and we have a 4-month-old infant.",
    detectedTrade: "HVAC",
    confidence: 98.7,
    priority: "high",
    matchedVendor: {
      name: "Summit Climate & HVAC Systems",
      phone: "+1 (512) 441-9081",
      rating: "4.8 ★ (95 jobs)",
      insurance: "Expires Jan 2028 • Verified",
    },
    aiInsight:
      "High indoor ambient temp with vulnerable occupant (infant). Elevated to Priority HIGH for same-day compressor diagnostics.",
    autoDraftReply:
      "Hello Sarah, we understand the indoor temperature has reached 86°F. We have assigned Summit Climate Systems to inspect the rooftop unit today between 1:00 PM – 3:00 PM.",
  },
  {
    id: "appliance-drain",
    label: "Dishwasher Error E15",
    property: "Cedar Ridge Townhomes",
    unit: "Unit 12B",
    issue: "Bosch dishwasher started beeping continuously and display is flashing Error Code E15. The drain pump is constantly buzzing even when off.",
    detectedTrade: "Appliance Repair",
    confidence: 97.5,
    priority: "medium",
    matchedVendor: {
      name: "Reliable Appliance Masters",
      phone: "+1 (512) 332-1140",
      rating: "4.9 ★ (210 jobs)",
      insurance: "Expires Aug 2027 • Verified",
    },
    aiInsight:
      "Error E15 denotes internal base pan flood sensor trip. Water leak safety switch engaged. Standard non-emergency repair ticket.",
    autoDraftReply:
      "Hi Mark, error E15 indicates the internal leak sensor was triggered. Reliable Appliance Masters has been dispatched to reset the pan float and test the seal.",
  },
];

export function InteractiveTriageDemo() {
  const [selectedId, setSelectedId] = React.useState<string>("water-leak");
  const [isSimulating, setIsSimulating] = React.useState<boolean>(false);

  const activeScenario = scenarios.find((s) => s.id === selectedId) || scenarios[0];

  const handleSelect = (id: string) => {
    if (id === selectedId) return;
    setIsSimulating(true);
    setSelectedId(id);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  return (
    <section id="interactive-demo" className="py-24 bg-zinc-950 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-violet-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/60 border border-violet-500/30 text-violet-300 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5 text-violet-400" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            See the AI Dispatcher in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400">
            Select a tenant maintenance scenario below to witness how Orqanta classifies trades, determines urgency, and matches vetted contractors in milliseconds.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {scenarios.map((scenario) => {
            const isSelected = scenario.id === selectedId;
            return (
              <button
                key={scenario.id}
                onClick={() => handleSelect(scenario.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 border ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white border-violet-400/50 shadow-lg shadow-violet-500/25 scale-[1.02]"
                    : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border-zinc-800"
                }`}
              >
                {scenario.priority === "urgent" && (
                  <Flame className="size-4 text-red-400 animate-pulse" />
                )}
                {scenario.priority === "high" && (
                  <AlertTriangle className="size-4 text-amber-400" />
                )}
                {scenario.priority === "medium" && (
                  <Wrench className="size-4 text-blue-400" />
                )}
                <span>{scenario.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Simulator Viewport */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Top Terminal Bar */}
            <div className="px-5 py-3.5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="font-mono text-violet-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  Gemini 3.8 Flash
                </span>
                <span className="text-zinc-600">•</span>
                <span className="font-mono">Inference Latency: 320ms</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Zero Hallucination Guard</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Tenant Request Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <User className="size-3.5" />
                    Tenant Input (From App or Public SDK)
                  </span>
                  <span className="text-zinc-500 font-mono">
                    {activeScenario.property} • {activeScenario.unit}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-zinc-200 text-sm leading-relaxed font-sans">
                  &ldquo;{activeScenario.issue}&rdquo;
                </div>
              </div>

              {/* AI Processing Card */}
              <AnimatePresence mode="wait">
                {isSimulating ? (
                  <motion.div
                    key="simulating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-8 rounded-xl bg-zinc-950/50 border border-zinc-800 flex flex-col items-center justify-center gap-3"
                  >
                    <Loader2 className="size-6 text-violet-400 animate-spin" />
                    <span className="text-xs font-mono text-zinc-400">
                      Analyzing symptom patterns & trade taxonomy...
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeScenario.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Triage Output Badges */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                          Classified Trade
                        </span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-base font-bold text-white">
                            {activeScenario.detectedTrade}
                          </span>
                          <span className="text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/50">
                            {activeScenario.confidence}% Match
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                          Assessed Priority
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          {activeScenario.priority === "urgent" && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-red-950/90 text-red-300 border border-red-700/60 flex items-center gap-1.5">
                              <Flame className="size-3.5" />
                              Urgent Hazard
                            </span>
                          )}
                          {activeScenario.priority === "high" && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-950/90 text-amber-300 border border-amber-700/60 flex items-center gap-1.5">
                              <AlertTriangle className="size-3.5" />
                              High Priority
                            </span>
                          )}
                          {activeScenario.priority === "medium" && (
                            <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-blue-950/90 text-blue-300 border border-blue-700/60 flex items-center gap-1.5">
                              <Wrench className="size-3.5" />
                              Standard Routine
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800">
                        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                          Contractor Match
                        </span>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                          <ShieldCheck className="size-4 shrink-0 text-emerald-400" />
                          <span className="truncate">{activeScenario.matchedVendor.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 block truncate">
                          {activeScenario.matchedVendor.insurance}
                        </span>
                      </div>
                    </div>

                    {/* AI Safety Assessment & Reasoning */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/30 to-indigo-950/20 border border-violet-500/30">
                      <div className="flex items-center gap-2 text-violet-300 text-xs font-semibold mb-1">
                        <Sparkles className="size-3.5" />
                        <span>AI Diagnostic Rationale</span>
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {activeScenario.aiInsight}
                      </p>
                    </div>

                    {/* Automated Drafted Tenant Response */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          <Send className="size-3.5 text-blue-400" />
                          Automated Tenant Dispatch Notice (SMS / Email)
                        </span>
                        <span className="text-zinc-500 font-mono text-[11px]">Ready to send</span>
                      </div>
                      <div className="p-4 rounded-xl bg-zinc-950/90 border border-zinc-800 text-xs sm:text-sm text-zinc-300 leading-relaxed italic">
                        &ldquo;{activeScenario.autoDraftReply}&rdquo;
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
