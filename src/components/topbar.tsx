"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Bell, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";

interface TopbarProps {
  userEmail?: string;
  userName?: string;
  orgName?: string;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Workspace Dashboard",
  "/work-orders": "Maintenance Work Orders",
  "/work-orders/new": "New Work Order",
  "/properties": "Property Portfolio",
  "/vendors": "Vendor Directory",
  "/tenants": "Tenant Roster",
  "/reports": "Monthly AI Reports",
  "/settings": "Workspace Settings",
};

export function Topbar({ userEmail, userName, orgName }: TopbarProps) {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname] || "Orqanta Workspace";

  return (
    <header className="h-16 px-4 md:px-8 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Mobile Sheet Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9 text-zinc-600">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-zinc-950 border-r border-zinc-800">
              <Sidebar
                userEmail={userEmail}
                userName={userName}
                orgName={orgName}
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Current Page Title */}
        <div className="flex items-center gap-2.5">
          <h2 className="text-base md:text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight">
            {currentTitle}
          </h2>
          <Badge
            variant="outline"
            className="hidden sm:inline-flex text-[11px] font-mono border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
          >
            {orgName || "Orqanta"}
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <Link href="/work-orders/new">
          <Button
            size="sm"
            className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-50 dark:hover:bg-zinc-200 dark:text-zinc-900 font-medium gap-1.5 shadow-sm text-xs md:text-sm h-9"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Request</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
