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
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 shadow-2xl shadow-black/40 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              src="/logo-icon.png"
              alt="Orqanta Emblem"
              width={34}
              height={34}
              className="size-8 sm:size-9 object-contain drop-shadow-[0_0_12px_rgba(59,130,246,0.3)] transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
              Orqanta
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                AI SaaS
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          <a
            href="#features"
            className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            Features
          </a>
          <a
            href="#interactive-demo"
            className="hover:text-white transition-colors flex items-center gap-1.5 group"
          >
            <Sparkles className="size-3.5 text-violet-400 group-hover:rotate-12 transition-transform" />
            <span>AI Triage Demo</span>
          </a>
          <a
            href="#how-it-works"
            className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            How it Works
          </a>
          <a
            href="#roi"
            className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            ROI Comparison
          </a>
          <a
            href="#faq"
            className="hover:text-white transition-colors hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
          >
            FAQ
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-violet-500/20 gap-2 border border-violet-400/30"
              >
                <LayoutDashboard className="size-4" />
                <span>Go to Dashboard</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-300 hover:text-white hover:bg-zinc-800/60 font-medium text-xs sm:text-sm"
                >
                  <LogIn className="size-3.5 mr-1.5" />
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white font-medium shadow-lg shadow-blue-500/25 border border-white/20 gap-1.5 transition-all duration-300 hover:scale-[1.02]"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-4 pb-6 bg-zinc-950/95 border-b border-zinc-800/80 backdrop-blur-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-3 text-base font-medium text-zinc-300">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              Features
            </a>
            <a
              href="#interactive-demo"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white flex items-center gap-2 text-violet-300"
            >
              <Sparkles className="size-4" />
              <span>AI Triage Demo</span>
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              How it Works
            </a>
            <a
              href="#roi"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              ROI Comparison
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-white"
            >
              FAQ
            </a>
          </nav>

          <div className="pt-3 border-t border-zinc-800/80 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white gap-2">
                  <LayoutDashboard className="size-4" />
                  <span>Go to Dashboard</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-zinc-700 text-zinc-200">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 text-white">
                    Start Free Trial
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
