"use client";

import * as React from "react";
import Image from "next/image";
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Trash2,
  Bot,
  User,
  ArrowDown,
  Minimize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const STARTER_PROMPTS = [
  "How does Orqanta AI triage work orders?",
  "Immediate steps for a burst water pipe?",
  "How do I track contractor insurance?",
  "How does the public tenant SDK work?",
];

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "Hello! I am **Orqanta AI**, your autonomous property maintenance assistant. Ask me how to triage repairs, evaluate tenant emergency hazards, pair vetted contractors, or navigate your workspace.",
      createdAt: new Date(),
    },
  ]);

  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content:
          data.message ||
          "I am here to assist. Could you provide a bit more detail about the issue?",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content:
            "I encountered a temporary connection issue. Please feel free to ask again or check your work order list in the dashboard.",
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "Conversation cleared. How can Orqanta AI assist your maintenance operations today?",
        createdAt: new Date(),
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 select-none">
      {/* Floating Toggle Button (Visible when closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-medium shadow-2xl shadow-violet-500/30 border border-white/20 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-violet-500/50"
          aria-label="Open Orqanta AI Assistant"
        >
          <div className="relative">
            <Sparkles className="size-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-sm font-semibold tracking-tight pr-0.5">
            Ask Orqanta AI
          </span>
        </button>
      )}

      {/* Floating Chat Modal Card */}
      {isOpen && (
        <div className="w-[360px] sm:w-[420px] h-[560px] max-h-[85vh] flex flex-col rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 backdrop-blur-xl">
          {/* Header Bar */}
          <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="size-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center shadow-inner">
                <Image
                  src="/logo-icon.png"
                  alt="Orqanta"
                  width={22}
                  height={22}
                  className="size-5 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                  Orqanta AI
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Copilot
                  </span>
                </span>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Maintenance Expert Online
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                title="Clear Chat"
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Minimize2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
            {messages.map((msg) => {
              const isAi = msg.role === "assistant";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${
                    isAi ? "justify-start" : "justify-end"
                  }`}
                >
                  {isAi && (
                    <div className="size-7 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="size-3.5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                      isAi
                        ? "bg-zinc-900/90 text-zinc-200 border border-zinc-800/90 shadow-sm rounded-tl-sm"
                        : "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md rounded-tr-sm font-medium"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {!isAi && (
                    <div className="size-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <User className="size-3.5 text-zinc-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="size-7 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="size-3.5 text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 flex items-center gap-2 rounded-tl-sm">
                  <Loader2 className="size-3.5 animate-spin text-violet-400" />
                  <span className="text-[11px] font-mono">
                    Orqanta AI is thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Starter Chips (show when only 1 welcome message is present) */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Quick Questions
              </span>
              <div className="flex flex-wrap gap-1.5">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-colors text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-zinc-900/95 border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about repairs, triage, or vendors..."
                disabled={isLoading}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500/70"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isLoading || !input.trim()}
                className="size-9 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl shrink-0 shadow-md transition-transform active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
            <div className="mt-1 text-center text-[10px] text-zinc-500">
              Orqanta AI provides maintenance guidance. Always verify shutoff valve safety in person.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
