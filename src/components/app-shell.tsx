"use client";

import * as React from "react";
import { SidebarProvider, useSidebar } from "./sidebar-context";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

interface AppShellProps {
  userEmail?: string;
  userName?: string;
  orgName?: string;
  isDemoMode?: boolean;
  children: React.ReactNode;
}

function AppShellInner({
  userEmail,
  userName,
  orgName,
  isDemoMode,
  children,
}: AppShellProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="h-screen w-full flex bg-[#fbfcfa] font-sans antialiased text-[#0b292b] overflow-hidden">
      {/* Desktop Persistent / Hideable Sidebar */}
      <div
        className={`hidden md:block transition-all duration-300 ease-in-out shrink-0 h-screen sticky top-0 overflow-hidden z-20 ${
          isCollapsed ? "w-0 opacity-0 pointer-events-none" : "w-64 opacity-100"
        }`}
      >
        <div className="w-64 h-screen">
          <Sidebar
            userEmail={userEmail}
            userName={userName}
            orgName={orgName}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden transition-all duration-300">
        <Topbar
          userEmail={userEmail}
          userName={userName}
          orgName={orgName}
          isDemoMode={isDemoMode}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <SidebarProvider>
      <AppShellInner {...props} />
    </SidebarProvider>
  );
}
