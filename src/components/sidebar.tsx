"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  Building2,
  Users,
  KeyRound,
  BarChart3,
  Settings,
  CreditCard,
  LogOut,
  ChevronRight,
  ShieldCheck,
  PanelLeftClose,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useSidebar } from "./sidebar-context";

interface SidebarProps {
  userEmail?: string;
  userName?: string;
  orgName?: string;
}

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Work Orders",
    href: "/work-orders",
    icon: Wrench,
  },
  {
    title: "Properties",
    href: "/properties",
    icon: Building2,
  },
  {
    title: "Vendors",
    href: "/vendors",
    icon: Users,
  },
  {
    title: "Tenants",
    href: "/tenants",
    icon: KeyRound,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    title: "Billing & Plans",
    href: "/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ userEmail, userName, orgName }: SidebarProps) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "MG";

  return (
    <aside className="w-64 h-screen max-h-screen flex flex-col justify-between bg-zinc-950 text-zinc-200 border-r border-zinc-800/80 overflow-y-auto select-none shrink-0 sticky top-0">
      {/* Brand & Organization */}
      <div className="flex flex-col">
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-900">
          <Link href="/dashboard" className="flex items-center group">
            <Image
              src="/orqanta-logo-white.png"
              alt="Orqanta"
              width={140}
              height={40}
              className="h-8 w-auto object-contain transition-opacity group-hover:opacity-95"
              priority
            />
          </Link>

          {/* Hide Sidebar Button */}
          <button
            onClick={toggleSidebar}
            title="Hide sidebar"
            className="hidden md:flex p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <PanelLeftClose className="size-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1">
          <div className="px-3 py-2 text-[10px] font-semibold tracking-wider uppercase text-zinc-500">
            Operations
          </div>
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  isActive
                    ? "bg-[#073b3a] text-white shadow-sm border border-emerald-600/30 font-semibold"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "size-4 transition-colors",
                      isActive
                        ? "text-emerald-400"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {isActive && (
                  <ChevronRight className="size-3 text-emerald-400" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Session & Sign Out */}
      <div className="p-3 border-t border-zinc-900 space-y-2">
        <div className="p-2 rounded-lg bg-zinc-900/60 flex items-center justify-between gap-3 border border-zinc-800/80">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8 border border-zinc-700 bg-zinc-800">
              <AvatarFallback className="text-xs font-semibold bg-[#073b3a] text-emerald-300">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-zinc-200 truncate max-w-[110px]">
                {userName || "Manager"}
              </span>
              <span className="text-[10px] text-zinc-500 truncate max-w-[110px]">
                {userEmail || "manager@orqanta.app"}
              </span>
            </div>
          </div>

          <form action={logoutAction}>
            <button
              type="submit"
              title="Sign Out"
              className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-500 py-1">
          <ShieldCheck className="size-3 text-emerald-500" />
          <span>Tenant Isolated (RLS)</span>
        </div>
      </div>
    </aside>
  );
}
