import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfcfa] px-4 py-8">
      {/* Top Header Logo */}
      <div className="flex items-center justify-center pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <Image
            src="/orqanta-logo.png"
            alt="Orqanta — Properties. People. Progress."
            width={184}
            height={76}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Main Centered Auth Form */}
      <div className="flex items-center justify-center w-full my-auto">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-xs text-slate-500">
        Properties. People. Progress. &copy; {new Date().getFullYear()} Orqanta. All rights reserved.
      </div>
    </div>
  );
}
