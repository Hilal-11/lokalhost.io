"use client";

import React, { useState, useEffect, CSSProperties } from "react";
import { IoCheckmarkOutline } from "react-icons/io5";
import { BiLogoTypescript } from "react-icons/bi";
import { codeToHtml } from "shiki";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { PiCopyDuotone } from "react-icons/pi";

interface CodeBlockProps {
  code: string;
  fileName?: string;
  language?: string;
  showLineNumbers?: boolean;
  lightTheme?: string; // e.g. "github-light"
  darkTheme?: string;  // e.g. "github-dark"

  // layout
  width?: string | number;   // e.g. 600, "100%", "40rem"
  height?: string | number;  // e.g. 400, "auto"
  borderRadius?: string | number; // e.g. 8, "0.5rem", "9999px"

  // colors (override the neutral defaults)
  bgColor?: string;          // light mode background
  darkBgColor?: string;      // dark mode background
  borderColor?: string;      // light mode border
  darkBorderColor?: string;  // dark mode border
  headerBgColor?: string;    // optional separate header bg (defaults to bgColor)
  darkHeaderBgColor?: string;

  className?: string; // escape hatch for anything else
}

function CodeBlock({
  code,
  fileName = "app/api/mcp/route.ts",
  language = "tsx",
  showLineNumbers = false,
  lightTheme = "github-light",
  darkTheme = "github-dark",

  width = 600,
  height = 400,
  borderRadius = 0,

  bgColor,
  darkBgColor,
  borderColor,
  darkBorderColor,
  headerBgColor,
  darkHeaderBgColor,

  className,
}: CodeBlockProps) {
  const { resolvedTheme } = useTheme();
  const [copied, setCopied] = useState(false);
  const isDark = resolvedTheme === "dark";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const containerStyle: CSSProperties = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
    borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
    backgroundColor: isDark ? darkBgColor ?? bgColor : bgColor,
    borderColor: isDark ? darkBorderColor ?? borderColor : borderColor,
  };

  const headerStyle: CSSProperties = {
    backgroundColor: isDark
      ? darkHeaderBgColor ?? headerBgColor
      : headerBgColor,
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div
        style={containerStyle}
        className={cn(
          "flex flex-col border overflow-hidden",
          // fall back to defaults only where no override color was given
          !bgColor && "bg-neutral-100",
          !darkBgColor && "dark:bg-black",
          !borderColor && "border-neutral-400",
          !darkBorderColor && "dark:border-neutral-700",
          className
        )}
      >
        {/* Header */}
        <div
          style={headerStyle}
          className={cn(
            "flex w-full justify-between items-center h-[50px] shrink-0 border-b",
            !borderColor && "border-neutral-400",
            !darkBorderColor && "dark:border-neutral-700"
          )}
        >
          <div className="flex items-center gap-2 px-4">
            <div>
              <BiLogoTypescript size={20} />
            </div>
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {fileName}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4">
            <button
              onClick={handleCopy}
              aria-label="Copy code"
              className="cursor-pointer flex items-center justify-center p-1 rounded-sm bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            >
              {copied ? (
                <IoCheckmarkOutline size={16} className="text-neutral-600 dark:text-neutral-500" />
              ) : (
                <PiCopyDuotone size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Code block part */}
        <div className="flex-1 min-h-0 overflow-auto">
          <CodeHighlight
            code={code}
            language={language}
            shikiTheme={isDark ? darkTheme : lightTheme}
            showLineNumbers={showLineNumbers}
          />
        </div>
      </div>
    </div>
  );
}

function CodeHighlight({
  code,
  language = "tsx",
  shikiTheme,
  showLineNumbers,
}: {
  code: string;
  language?: string;
  shikiTheme: string;
  showLineNumbers: boolean;
}) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: language,
      theme: shikiTheme,
    }).then((h) => {
      if (!cancelled) setHtml(h);
    });
    return () => {
      cancelled = true;
    };
  }, [code, language, shikiTheme]);

  if (!html) {
    return <CodeFallback code={code} showLineNumbers={showLineNumbers} />;
  }

  return (
    <>
      {showLineNumbers && (
        <style>{`
          .shiki-lines code { counter-reset: line; }
          .shiki-lines .line { counter-increment: line; display: inline-block; width: 100%; }
          .shiki-lines .line::before {
            content: counter(line);
            display: inline-block;
            width: 2rem;
            margin-right: 0.50rem;
            text-align: right;
            color: hsl(var(--muted-foreground));
            opacity: 0.4;
            user-select: none;
          }
        `}</style>
      )}
      <div
        style={{ fontFamily: "'Geist Mono', 'Geist Mono Fallback', monospace" }}
        className={cn(
          showLineNumbers && "shiki-lines",
          "[&>pre]:overflow-x-auto [&>pre]:text-[12px] [&>pre]:leading-relaxed [&>pre]:py-4",
          showLineNumbers ? "[&>pre]:pl-0 [&>pre]:pr-4" : "[&>pre]:px-4",
          // force transparent bg so the container's own bg shows through
          "[&>pre]:!bg-transparent [&_code]:!bg-transparent [&>pre]:![font-family:inherit]"
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}

function CodeFallback({
  code,
  showLineNumbers,
}: {
  code: string;
  showLineNumbers: boolean;
}) {
  const lines = code.split("\n");
  return (
    <pre className="overflow-x-auto text-[12px] leading-relaxed font-mono text-foreground px-4 py-4">
      <code
        className={showLineNumbers ? "grid" : "block"}
        style={showLineNumbers ? { gridTemplateColumns: "auto 1fr" } : undefined}
      >
        {lines.map((line, i) =>
          showLineNumbers ? (
            <span key={i} className="contents">
              <span className="select-none pr-2 text-right text-muted-foreground/40">
                {i + 1}
              </span>
              <span>{line || "\u00A0"}</span>
            </span>
          ) : (
            <span key={i} className="block">
              {line || "\u00A0"}
            </span>
          )
        )}
      </code>
    </pre>
  );
}

export default CodeBlock;