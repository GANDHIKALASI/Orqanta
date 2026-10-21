import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      {/* Top Header Logo */}
      <div className="flex items-center justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-zinc-900 dark:text-zinc-50 font-semibold tracking-tight text-xl"
        >
          <div className="size-8 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 flex items-center justify-center shadow-sm">
            <Sparkles className="size-4 text-violet-400 dark:text-violet-600" />
          </div>
          <span>Orqanta</span>
        </Link>
      </div>

      {/* Main Centered Auth Form */}
      <div className="flex items-center justify-center w-full my-auto">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-zinc-400 dark:text-zinc-600">
        AI-native maintenance workspace &copy; {new Date().getFullYear()} Orqanta. All rights reserved.
      </div>
    </div>
  );
}
