"use client";

import * as React from "react";
import { toast } from "sonner";
import { Key, Copy, Check } from "lucide-react";
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
    <div className="rounded-xl border border-[#dfe8e3] bg-white shadow-sm overflow-hidden">
      <div className="p-4 px-5 border-b border-[#dfe8e3]/60 bg-[#fbfcfa]/60">
        <h2 className="text-base font-semibold text-[#073b3a] flex items-center gap-2">
          <Key className="size-4 text-emerald-700" />
          Public Submission SDK Key
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Use this key to authenticate maintenance ticket submissions from external websites or tenant portals.
        </p>
      </div>
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 p-2.5 rounded-lg bg-[#fbfcfa] border border-[#dfe8e3] font-mono text-xs text-[#073b3a] truncate select-all">
            {apiKey || "No API key provisioned"}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="gap-1.5 shrink-0 border-[#dfe8e3] hover:bg-[#eef5f1] text-[#073b3a]"
          >
            {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5 text-emerald-700" />}
            <span>{copied ? "Copied" : "Copy Key"}</span>
          </Button>
        </div>

        <div className="p-3.5 rounded-lg bg-[#fbfcfa] border border-[#dfe8e3] space-y-2">
          <p className="text-xs font-semibold text-[#073b3a]">
            Embed Snippet:
          </p>
          <pre className="text-[11px] font-mono text-slate-700 overflow-x-auto p-2.5 bg-white border border-[#dfe8e3] rounded-lg">
{`<script src="https://orqanta.app/sdk/orqanta-sdk.js"
        data-org-key="${apiKey}"
        data-theme="light"></script>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
