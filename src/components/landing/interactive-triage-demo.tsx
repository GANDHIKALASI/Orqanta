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
} from "lucide-react";

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
    }, 350);
  };

  return (
    <section id="interactive-demo" className="py-20 bg-white border-y border-[#dfe8e3] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#eef5f1] border border-[#cbdad3] text-emerald-800 text-xs font-semibold mb-4">
            <Sparkles className="size-3.5 text-emerald-700" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-[-.04em] text-[#073b3a]">
            See the AI Dispatcher in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
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
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2.5 border ${
                  isSelected
                    ? "bg-[#073b3a] text-white border-[#073b3a] shadow-sm scale-[1.02]"
                    : "bg-[#fbfcfa] hover:bg-slate-100 text-slate-700 border-slate-200"
                }`}
              >
                {scenario.priority === "urgent" && (
                  <Flame className="size-4 text-rose-500 animate-pulse" />
                )}
                {scenario.priority === "high" && (
                  <AlertTriangle className="size-4 text-amber-500" />
                )}
                {scenario.priority === "medium" && (
                  <Wrench className="size-4 text-emerald-600" />
                )}
                <span>{scenario.label}</span>
              </button>
            );
          })}
        </div>

        {/* Live Simulator Viewport */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="rounded-xl border border-slate-200 bg-[#fbfcfa] shadow-[0_20px_60px_rgba(4,38,38,0.06)] overflow-hidden">
            {/* Top Window Bar with macOS traffic lights */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="size-2.5 rounded-full bg-rose-400" />
                  <div className="size-2.5 rounded-full bg-amber-400" />
                  <div className="size-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-slate-300">|</span>
                <span className="font-mono text-[#073b3a] font-semibold text-xs flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-emerald-700" />
                  Orqanta AI Engine
                </span>
                <span className="text-slate-300">•</span>
                <span className="font-mono text-[11px] text-slate-400">Inference: 320ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-800 bg-[#eef5f1] px-2 py-0.5 rounded border border-[#cbdad3]">
                <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <span>Zero Hallucination Guard</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Tenant Request Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <User className="size-3.5 text-emerald-700" />
                    Tenant Input (From App or Public Portal)
                  </span>
                  <span className="text-slate-500 font-mono text-[11px]">
                    {activeScenario.property} • {activeScenario.unit}
                  </span>
                </div>
                <div className="p-4 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm leading-relaxed font-sans shadow-sm">
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
                    className="p-8 rounded-lg bg-white border border-slate-200 flex flex-col items-center justify-center gap-3"
                  >
                    <Loader2 className="size-6 text-emerald-700 animate-spin" />
                    <span className="text-xs font-mono text-slate-500">
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
                      <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Classified Trade
                        </span>
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-base font-bold text-[#073b3a]">
                            {activeScenario.detectedTrade}
                          </span>
                          <span className="text-xs font-mono text-emerald-800 font-semibold bg-[#eef5f1] px-2 py-0.5 rounded border border-[#cbdad3]">
                            {activeScenario.confidence}% Match
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Assessed Priority
                        </span>
                        <div className="mt-1 flex items-center gap-2">
                          {activeScenario.priority === "urgent" && (
                            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                              <Flame className="size-3.5 text-rose-600" />
                              Urgent Hazard
                            </span>
                          )}
                          {activeScenario.priority === "high" && (
                            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                              <AlertTriangle className="size-3.5 text-amber-600" />
                              High Priority
                            </span>
                          )}
                          {activeScenario.priority === "medium" && (
                            <span className="px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                              <Wrench className="size-3.5 text-emerald-700" />
                              Standard Routine
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm">
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                          Contractor Match
                        </span>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-800 font-semibold truncate">
                          <ShieldCheck className="size-4 shrink-0 text-emerald-700" />
                          <span className="truncate">{activeScenario.matchedVendor.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                          {activeScenario.matchedVendor.insurance}
                        </span>
                      </div>
                    </div>

                    {/* AI Safety Assessment & Reasoning */}
                    <div className="p-4 rounded-lg bg-[#073b3a] text-white space-y-1.5 shadow-sm">
                      <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                        <Sparkles className="size-3.5" />
                        <span>AI Diagnostic Rationale</span>
                      </div>
                      <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed font-sans">
                        {activeScenario.aiInsight}
                      </p>
                    </div>

                    {/* Automated Drafted Tenant Response */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          <Send className="size-3.5 text-emerald-700" />
                          Automated Tenant Notice (SMS / Email)
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">Ready to dispatch</span>
                      </div>
                      <div className="p-4 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed italic shadow-sm">
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
