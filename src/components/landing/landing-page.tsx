"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { LandingNavbar } from "./navbar";
import { LandingHero } from "./hero";
import { InteractiveTriageDemo } from "./interactive-triage-demo";
import { LandingFeatures } from "./features";
import { LandingHowItWorks } from "./how-it-works";
import { LandingComparisonRoi } from "./comparison-roi";
import { LandingFaq } from "./faq";
import { LandingCtaBanner } from "./cta-banner";
import { LandingFooter } from "./footer";

interface LandingPageProps {
  isAuthenticated: boolean;
  userEmail?: string | null;
}

export function LandingPage({ isAuthenticated, userEmail }: LandingPageProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-violet-500/30 selection:text-violet-200">
      {/* Top Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 origin-left z-50 shadow-[0_0_12px_rgba(139,92,246,0.8)]"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <LandingNavbar isAuthenticated={isAuthenticated} userEmail={userEmail} />

      {/* Hero Section */}
      <LandingHero isAuthenticated={isAuthenticated} />

      {/* Interactive Live Triage Simulator */}
      <InteractiveTriageDemo />

      {/* Core Feature Matrix */}
      <LandingFeatures />

      {/* How it Works / 3-Step Pipeline */}
      <LandingHowItWorks />

      {/* ROI & Side-by-Side Comparison */}
      <LandingComparisonRoi />

      {/* Frequently Asked Questions */}
      <LandingFaq />

      {/* High-Impact CTA Banner */}
      <LandingCtaBanner isAuthenticated={isAuthenticated} />

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
