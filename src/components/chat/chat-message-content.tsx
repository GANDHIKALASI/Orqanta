"use client";

import * as React from "react";

interface ChatMessageContentProps {
  content: string;
  isAi: boolean;
}

/**
 * Parses markdown inline formatting (bold, italic, inline code)
 */
function renderInlineText(text: string): React.ReactNode[] {
  // Regex to match **bold**, *italic*, and `code`
  const tokenRegex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#073b3a] dark:text-emerald-300">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={index} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-[#073b3a] dark:text-emerald-300 font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

/**
 * High-fidelity Markdown Message renderer for Orqanta AI chat
 * Renders paragraphs, bullet points, numbered lists, subheadings, and bold text cleanly.
 */
export function ChatMessageContent({ content, isAi }: ChatMessageContentProps) {
  if (!isAi) {
    return <span className="whitespace-pre-wrap">{content}</span>;
  }

  // Split content into blocks by double newlines or lines
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentListItems: string[] = [];
  let isNumberedList = false;

  const flushList = (keyPrefix: string) => {
    if (currentListItems.length === 0) return;

    if (isNumberedList) {
      elements.push(
        <ol key={`ol-${keyPrefix}`} className="space-y-1.5 my-2 pl-1">
          {currentListItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700">
              <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 size-4 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="flex-1">{renderInlineText(item)}</span>
            </li>
          ))}
        </ol>
      );
    } else {
      elements.push(
        <ul key={`ul-${keyPrefix}`} className="space-y-1.5 my-2 pl-1">
          {currentListItems.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-slate-700">
              <span className="size-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span className="flex-1">{renderInlineText(item)}</span>
            </li>
          ))}
        </ul>
      );
    }

    currentListItems = [];
    isNumberedList = false;
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Empty line -> flush list and skip
    if (!trimmed) {
      flushList(`flush-${index}`);
      return;
    }

    // Bullet list item (*, -, or •)
    const bulletMatch = trimmed.match(/^([*\-•])\s+(.*)$/);
    if (bulletMatch) {
      if (isNumberedList) flushList(`num-to-bullet-${index}`);
      isNumberedList = false;
      currentListItems.push(bulletMatch[2]);
      return;
    }

    // Numbered list item (1., 2., etc.)
    const numMatch = trimmed.match(/^(\d+)[.)]\s+(.*)$/);
    if (numMatch) {
      if (!isNumberedList && currentListItems.length > 0) flushList(`bullet-to-num-${index}`);
      isNumberedList = true;
      currentListItems.push(numMatch[2]);
      return;
    }

    // If regular text comes after a list, flush the list
    flushList(`text-${index}`);

    // Heading (###, ##, #)
    const headerMatch = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (headerMatch) {
      elements.push(
        <h4
          key={`h-${index}`}
          className="font-bold text-[#073b3a] text-xs sm:text-sm mt-2 mb-1 first:mt-0"
        >
          {renderInlineText(headerMatch[2])}
        </h4>
      );
      return;
    }

    // Standard paragraph line
    elements.push(
      <p key={`p-${index}`} className="mb-1.5 last:mb-0 leading-relaxed text-slate-800">
        {renderInlineText(trimmed)}
      </p>
    );
  });

  // Flush any trailing list
  flushList("end");

  return <div className="space-y-1 text-xs">{elements}</div>;
}
