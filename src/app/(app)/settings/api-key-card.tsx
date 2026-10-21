"use client";

import * as React from "react";
import { toast } from "sonner";
import { Key, Copy, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ApiKeyCard({ apiKey }: { apiKey: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    toast.success("Public API Key copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
      <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Key className="size-4 text-zinc-500" />
          Public Submission SDK Key
        </CardTitle>
        <CardDescription>
          Use this key to authenticate maintenance ticket submissions from external websites or tenant portals.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-zinc-800 dark:text-zinc-200 truncate select-all">
            {apiKey || "No API key provisioned"}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="gap-1.5 shrink-0"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            <span>{copied ? "Copied" : "Copy Key"}</span>
          </Button>
        </div>

        <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
          <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Embed Snippet:
          </p>
          <pre className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto p-2 bg-zinc-100 dark:bg-zinc-900 rounded">
{`<script src="https://orqanta.app/sdk/orqanta-sdk.js"
        data-org-key="${apiKey}"
        data-theme="light"></script>`}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
