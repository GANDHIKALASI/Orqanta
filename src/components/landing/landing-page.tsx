"use client";

import * as React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { LandingNavbar } from "./navbar";
import { LandingHero } from "./hero";
import { InteractiveTriageDemo } from "./interactive-triage-demo";
import { LandingFeatures } from "./features";
import { LandingSolutions } from "./solutions";
import { LandingHowItWorks } from "./how-it-works";
import { LandingIntegrations } from "./integrations";
import { LandingComparisonRoi } from "./comparison-roi";
import { LandingPricing } from "./pricing";
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
    <div className="min-h-screen bg-[#fbfcfa] text-[#0b292b] selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Top Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#073b3a] origin-left z-50"
        style={{ scaleX }}
      />

      {/* Navigation */}
      <LandingNavbar isAuthenticated={isAuthenticated} userEmail={userEmail} />

      {/* Hero Section with DashboardPreview */}
      <LandingHero isAuthenticated={isAuthenticated} />

      {/* Interactive Live AI Triage Simulator */}
      <InteractiveTriageDemo />

      {/* Core Architectural Features */}
      <LandingFeatures />

      {/* Stakeholder Solutions (Property Managers, Residents, Contractors, Owners) */}
      <LandingSolutions />

      {/* 3-Step Execution Pipeline */}
      <LandingHowItWorks />

      {/* Embedded Requests & QR Integrations */}
      <LandingIntegrations />

      {/* Operational ROI & Side-by-Side Comparison */}
      <LandingComparisonRoi />

      {/* Transparent Pricing (₹199/mo & ₹1999/yr) */}
      <LandingPricing isAuthenticated={isAuthenticated} />

      {/* Frequently Asked Questions */}
      <LandingFaq />

      {/* Signature Forest Green CTA Banner */}
      <LandingCtaBanner isAuthenticated={isAuthenticated} />

      {/* Architectural Multi-Column Footer */}
      <LandingFooter />
    </div>
  );
}
