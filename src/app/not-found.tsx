import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  Wrench,
  Home,
  HelpCircle,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "404 — Unit Not Found | Orqanta",
  description:
    "The maintenance resource or property wing you requested could not be located.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fbfcfa] text-[#0b292b] flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Top Navbar */}
      <header className="border-b border-[#dfe8e3] bg-[#fbfcfa]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" aria-label="Orqanta Home">
            <Image
              src="/orqanta-logo.png"
              alt="Orqanta"
              width={140}
              height={58}
              className="h-auto w-[125px] sm:w-[138px] object-contain object-left transition-opacity group-hover:opacity-90"
              priority
            />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="size-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Status: 404 Not Found</span>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-[#073b3a] hover:bg-[#073b3a]/90 text-white transition-all shadow-sm"
            >
              <LayoutDashboard className="size-3.5" />
              <span>Open App</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main 404 Hero */}
      <main className="flex-1 flex items-center justify-center px-5 py-12 md:py-20 relative overflow-hidden">
        {/* Subtle background ambient gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-emerald-100/50 via-teal-50/40 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-2xl w-full text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-medium tracking-wide">
            <Building2 className="size-3.5 text-amber-700" />
            <span>Off-Market / Unregistered Unit</span>
          </div>

          {/* Large Stylized 404 Number */}
          <div className="relative">
            <div className="text-8xl sm:text-9xl md:text-[11rem] font-black tracking-tighter text-[#073b3a]/10 select-none leading-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-[#073b3a]">
                404
              </span>
            </div>
          </div>

          {/* Title & Copy */}
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#073b3a]">
              This wing of the property doesn&apos;t exist
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              The page, unit ticket, or floorplan resource you are looking for has been decommissioned, relocated, or never existed in your workspace roster.
            </p>
          </div>

          {/* Primary Quick Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#073b3a] text-white hover:bg-[#073b3a]/90 font-semibold text-sm transition-all shadow-md shadow-[#073b3a]/15 hover:shadow-lg hover:-translate-y-0.5"
            >
              <LayoutDashboard className="size-4" />
              <span>Back to Dashboard</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-700 hover:text-[#073b3a] hover:bg-slate-50 border border-[#dfe8e3] font-semibold text-sm transition-all shadow-sm hover:-translate-y-0.5"
            >
              <Home className="size-4" />
              <span>Return to Homepage</span>
            </Link>
          </div>

          {/* Helpful Navigation Cards */}
          <div className="pt-8 border-t border-[#dfe8e3]/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <Link
              href="/work-orders"
              className="p-4 rounded-xl bg-white border border-[#dfe8e3] hover:border-emerald-600/40 hover:shadow-md transition-all group"
            >
              <div className="size-8 rounded-lg bg-emerald-50 text-[#073b3a] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Wrench className="size-4 text-emerald-700" />
              </div>
              <h2 className="text-xs font-bold text-[#073b3a] group-hover:text-emerald-700 transition-colors">
                Work Orders
              </h2>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Browse active maintenance dispatches and emergency tickets.
              </p>
            </Link>

            <Link
              href="/properties"
              className="p-4 rounded-xl bg-white border border-[#dfe8e3] hover:border-emerald-600/40 hover:shadow-md transition-all group"
            >
              <div className="size-8 rounded-lg bg-emerald-50 text-[#073b3a] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <Building2 className="size-4 text-emerald-700" />
              </div>
              <h2 className="text-xs font-bold text-[#073b3a] group-hover:text-emerald-700 transition-colors">
                Properties Roster
              </h2>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Explore multi-unit buildings, tenant units, and vendor assignments.
              </p>
            </Link>

            <a
              href="mailto:support@orqanta.app"
              className="p-4 rounded-xl bg-white border border-[#dfe8e3] hover:border-emerald-600/40 hover:shadow-md transition-all group"
            >
              <div className="size-8 rounded-lg bg-emerald-50 text-[#073b3a] flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                <HelpCircle className="size-4 text-emerald-700" />
              </div>
              <h2 className="text-xs font-bold text-[#073b3a] group-hover:text-emerald-700 transition-colors">
                Contact Support
              </h2>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                Need assistance? Our operations team is available 24/7.
              </p>
            </a>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#dfe8e3] bg-white py-4 px-5 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>Orqanta Cloud Infrastructure • Protected & Tenant Isolated</span>
        </div>
        <p className="mt-2 sm:mt-0">
          © {new Date().getFullYear()} Orqanta Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
