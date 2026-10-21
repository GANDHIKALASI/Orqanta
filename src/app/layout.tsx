import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { FloatingChatbot } from "@/components/chat/floating-chatbot";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orqanta — AI-Native Maintenance Workspace",
  description:
    "AI-native, multi-tenant maintenance workspace for property managers (50–500 units).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        {children}
        <FloatingChatbot />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
