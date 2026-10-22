"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, Database } from "lucide-react";
import { toast } from "sonner";
import { toggleDemoDataAction } from "@/app/(app)/demo-actions";

interface DemoDataToggleProps {
  initialDemoState?: boolean;
}

export function DemoDataToggle({ initialDemoState = false }: DemoDataToggleProps) {
  const router = useRouter();
  const [isDemo, setIsDemo] = React.useState(initialDemoState);
  const [isPending, setIsPending] = React.useState(false);

  React.useEffect(() => {
    setIsDemo(initialDemoState);
  }, [initialDemoState]);

  const handleToggle = async () => {
    if (isPending) return;
    const nextState = !isDemo;
    setIsPending(true);

    try {
      const res = await toggleDemoDataAction(nextState);
      if (res.success) {
        setIsDemo(nextState);
        if (nextState) {
          toast.success("✨ Demo data loaded!", {
            description: "Added 3 properties, 4 vendors, and 5 AI-triaged work orders.",
          });
        } else {
          toast.info("Demo data cleared", {
            description: "Your workspace has been restored to a clean state.",
          });
        }
        router.refresh();
      } else {
        toast.error("Failed to update demo data", {
          description: res.error || "Please try again.",
        });
      }
    } catch (err: unknown) {
      toast.error("Something went wrong", {
        description: err instanceof Error ? err.message : "Network error",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      title={
        isDemo
          ? "Click to remove demo data and return to clean workspace"
          : "Click to load realistic demo properties, vendors, and AI work orders"
      }
      className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border shadow-xs select-none ${
        isDemo
          ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
          : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700"
      }`}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin text-emerald-600 dark:text-emerald-400" />
      ) : isDemo ? (
        <Sparkles className="size-3.5 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Database className="size-3.5 text-zinc-400 dark:text-zinc-500" />
      )}

      <span className="font-semibold text-[11px] tracking-tight">
        {isPending ? "Updating..." : "Demo Data"}
      </span>

      {/* Mini Toggle Switch Pill */}
      <span
        className={`w-7 h-4 flex items-center rounded-full p-0.5 transition-colors duration-200 ${
          isDemo ? "bg-emerald-600 justify-end" : "bg-zinc-300 dark:bg-zinc-700 justify-start"
        }`}
      >
        <span className="bg-white size-3 rounded-full shadow-xs transition-transform transform" />
      </span>
    </button>
  );
}
