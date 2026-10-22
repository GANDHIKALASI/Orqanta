"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, LayoutDashboard, LogIn, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isAuthenticated: boolean;
  userEmail?: string | null;
}

export function LandingNavbar({ isAuthenticated }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 border-b ${
        scrolled
          ? "border-[#dfe8e3] bg-[#fbfcfa]/95 backdrop-blur shadow-sm py-2.5"
          : "border-[#dfe8e3]/80 bg-[#fbfcfa]/90 backdrop-blur py-3"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group" aria-label="Orqanta Home">
          <Image
            src="/orqanta-logo.png"
            alt="Orqanta — Properties. People. Progress."
            width={148}
            height={62}
            className="h-auto w-[130px] sm:w-[145px] object-contain object-left transition-opacity duration-200 group-hover:opacity-90"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a
            href="#features"
            className="hover:text-[#073b3a] transition-colors"
          >
            Product
          </a>
          <a
            href="#interactive-demo"
            className="hover:text-[#073b3a] transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="size-3.5 text-emerald-700" />
            <span>AI Triage Demo</span>
          </a>
          <a
            href="#how-it-works"
            className="hover:text-[#073b3a] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#roi"
            className="hover:text-[#073b3a] transition-colors"
          >
            Impact
          </a>
          <a
            href="#pricing"
            className="hover:text-[#073b3a] transition-colors font-semibold text-emerald-800"
          >
            Pricing
          </a>
          <a
            href="#faq"
            className="hover:text-[#073b3a] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="rounded-lg bg-[#073b3a] px-4 text-white hover:bg-[#0a504d] text-xs font-semibold gap-1.5 shadow-sm transition-all"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-700 hover:text-[#073b3a] hover:bg-emerald-50/60 font-medium text-sm"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="rounded-md bg-[#073b3a] px-4 text-white hover:bg-[#0a504d] text-sm font-medium gap-1.5 shadow-sm transition-all"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-slate-700 hover:text-[#073b3a] hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <nav className="md:hidden flex flex-col gap-3 border-t border-[#dfe8e3] bg-[#fbfcfa] px-5 py-5 text-sm font-medium text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
          <a
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 hover:text-[#073b3a]"
          >
            Product
          </a>
          <a
            href="#interactive-demo"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 hover:text-[#073b3a] flex items-center gap-2 text-emerald-800"
          >
            <Sparkles className="size-4 text-emerald-700" />
            <span>AI Triage Demo</span>
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 hover:text-[#073b3a]"
          >
            How It Works
          </a>
          <a
            href="#roi"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 hover:text-[#073b3a]"
          >
            Impact
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 text-emerald-800 font-semibold"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="py-1.5 hover:text-[#073b3a]"
          >
            FAQ
          </a>

          <div className="pt-3 border-t border-[#dfe8e3] flex flex-col gap-2">
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#073b3a] hover:bg-[#0a504d] text-white gap-2 text-xs font-semibold">
                  <span>Go to Workspace</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-slate-300 text-slate-800">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#073b3a] hover:bg-[#0a504d] text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
