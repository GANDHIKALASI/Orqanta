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
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ userEmail, userName, orgName }: SidebarProps) {
  const pathname = usePathname();

  const initials = userName
    ? userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "MG";

  return (
    <aside className="w-64 flex flex-col justify-between bg-zinc-950 text-zinc-200 border-r border-zinc-800/80 min-h-screen select-none shrink-0">
      {/* Brand & Organization */}
      <div className="flex flex-col">
        <div className="h-16 px-5 flex items-center gap-3 border-b border-zinc-900">
          <Image
            src="/logo-icon.png"
            alt="Orqanta Logo"
            width={32}
            height={32}
            className="size-8 object-contain rounded"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-white tracking-tight text-base leading-tight">
              Orqanta
            </span>
            <span className="text-[11px] text-zinc-400 font-medium truncate max-w-[150px]">
              {orgName || "Maintenance Workspace"}
            </span>
          </div>
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
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "size-4 transition-colors",
                      isActive
                        ? "text-violet-400"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />
                  <span>{item.title}</span>
                </div>
                {isActive && (
                  <ChevronRight className="size-3 text-zinc-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* User Session & Sign Out */}
      <div className="p-3 border-t border-zinc-900 space-y-2">
        <div className="p-2 rounded-lg bg-zinc-900/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="size-8 border border-zinc-700 bg-zinc-800">
              <AvatarFallback className="text-xs font-semibold bg-violet-950 text-violet-300">
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
