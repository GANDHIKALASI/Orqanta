import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-zinc-50 dark:bg-zinc-950 px-4 py-8">
      {/* Top Header Logo */}
      <div className="flex items-center justify-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <Image
            src="/logo.png"
            alt="Orqanta"
            width={180}
            height={50}
            priority
            className="h-10 w-auto object-contain rounded-md"
          />
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
