"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Menu, PanelLeft, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar";
import { DemoDataToggle } from "@/components/demo-data-toggle";
import { useSidebar } from "./sidebar-context";

interface TopbarProps {
  userEmail?: string;
  userName?: string;
  orgName?: string;
  isDemoMode?: boolean;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Workspace Dashboard",
  "/work-orders": "Maintenance Work Orders",
  "/work-orders/new": "New Work Order",
  "/properties": "Property Portfolio",
  "/vendors": "Vendor Directory",
  "/tenants": "Tenant Roster",
  "/reports": "Monthly AI Reports",
  "/billing": "Billing & Plans",
  "/settings": "Workspace Settings",
};

export function Topbar({ userEmail, userName, orgName, isDemoMode = false }: TopbarProps) {
  const pathname = usePathname();
  const currentTitle = pageTitles[pathname] || "Orqanta Workspace";
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <header className="h-16 px-4 md:px-8 border-b border-[#dfe8e3] bg-[#fbfcfa]/95 backdrop-blur-md flex items-center justify-between sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Sheet Trigger */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="size-9 text-slate-600 hover:text-[#073b3a]">
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

        {/* Desktop Sidebar Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          title={isCollapsed ? "Expand sidebar" : "Hide sidebar"}
          className="hidden md:inline-flex size-9 text-slate-600 hover:text-[#073b3a] hover:bg-[#eef5f1] transition-colors"
        >
          {isCollapsed ? <PanelLeft className="size-4" /> : <PanelLeftClose className="size-4" />}
        </Button>

        {/* Current Page Title */}
        <div className="flex items-center gap-2.5">
          <h2 className="text-base md:text-lg font-semibold text-[#073b3a] tracking-tight">
            {currentTitle}
          </h2>
          <Badge
            variant="outline"
            className="hidden sm:inline-flex text-[11px] font-mono border-slate-300 text-slate-600 bg-white"
          >
            {orgName || "Orqanta"}
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mini Demo Data Toggle */}
        <DemoDataToggle initialDemoState={isDemoMode} />

        <Link href="/work-orders/new">
          <Button
            size="sm"
            className="bg-[#073b3a] hover:bg-[#0a504d] text-white font-semibold gap-1.5 shadow-sm text-xs md:text-sm h-9"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">New Request</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
