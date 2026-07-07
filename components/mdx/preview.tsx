"use client";

import { cn } from "@/lib/utils";
import { Suspense, useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ui/theme-toggle"
import {
  Check,
  ChevronDown,
  Copy,
  Maximize2,
  Minimize2,
  X,
} from "lucide-react";
import { SiNpm, SiPnpm, SiYarn } from 'react-icons/si'
import { PiCatBold } from "react-icons/pi";
import { SiClaude } from "react-icons/si";
import { TbCursorText } from "react-icons/tb";
import { TbBrandVercelFilled } from "react-icons/tb";
import { GiWrappedHeart } from "react-icons/gi";
import { HiOutlineTerminal } from "react-icons/hi";
import { TbEyeSpark } from "react-icons/tb";

interface PreviewProps {
  children: React.ReactNode;
  className?: string;
  isPremium?: boolean;
  link: string;
  useIframe?: boolean;
  height?: string;
  compact?: boolean;
  comment?: string[];
  isBlock?: boolean;
  code?: string;
  language?: string;
}

type PackageManager = "npx" | "pnpm" | "yarn" | "bun";
type AITool = "claude" | "v0" | "lovable" | "cursor";

const prePath = process.env.NEXT_PUBLIC_BASE_URL
  ? `https://${process.env.NEXT_PUBLIC_BASE_URL}`
  : "http://localhost:3000";

const packageCommands: Record<PackageManager, (slug: string) => string> = {
  npx:  (slug) => `npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/r/${slug}`,
  pnpm: (slug) => `pnpm dlx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/r/${slug}`,
  yarn: (slug) => `yarn dlx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/r/${slug}`,
  bun:  (slug) => `bunx --bun shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/r/${slug}`,
};



const pmIcons: Record<PackageManager, React.ReactNode> = {
  npx:  <SiNpm size={14} />,
  pnpm: <SiPnpm size={14} />,
  yarn: <SiYarn size={14} />,
  bun:  <PiCatBold size={14} />,
};

const pmColors: Record<PackageManager, string> = {
  npx:  "text-red-500",
  pnpm: "text-yellow-500",
  yarn: "text-blue-400",
  bun:  "text-orange-400",
};

const pmLabels: Record<PackageManager, string> = {
  npx:  "npm",
  pnpm: "pnpm",
  yarn: "yarn",
  bun:  "bun",
};

const aiPrompts: Record<AITool, (slug: string) => string> = {
  claude: (slug) =>
    `Install and use the ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/${slug} component from the shadcn registry: npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/${slug}`,
  v0: (slug) =>
    `Use the ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/${slug} shadcn component. Install with: npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/${slug}`,
  lovable: (slug) =>
    `Add the ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/${slug} component using: npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/${slug}`,
  cursor: (slug) =>
    `Install ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/${slug}: npx shadcn@latest add ${process.env.NEXT_PUBLIC_BASE_URL ? process.env.NEXT_PUBLIC_BASE_URL : "http://localhost:3000"}/${slug}`,
};

const AIIcons: Record<AITool, React.ReactNode> = {
  claude:  <SiClaude size={16} />,
  v0:      <TbBrandVercelFilled size={16} />,
  lovable: <GiWrappedHeart size={16} />,
  cursor:  <TbCursorText size={16} />,
};



function InstallDropdown({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PackageManager>("npx");
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const command = packageCommands[selected](slug);

  const handleCopy = async () => {
    if (copied) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(command);
      } else {
        const el = document.createElement("textarea");
        el.value = command;
        el.style.cssText = "position:absolute;left:-9999px;top:-9999px";
        document.body.appendChild(el);
        el.focus();
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    // ✅ z-[999] so dropdown punches above the content area's z-50
    <div ref={ref} className="relative flex items-center p-[3px] bg-neutral-200/60 dark:bg-neutral-800/60 rounded-[9px] z-[999]">
      <div className="flex items-center bg-white dark:bg-neutral-950 rounded-[7px] border border-border overflow-hidden h-7">

        {/* Left: icon + command — click to copy */}
        <button
          onClick={handleCopy}
          title="Click to copy"
          className={cn(
            "flex items-center gap-2 pl-2.5 pr-3 h-full text-[12px] font-mono font-medium transition-colors select-none",
            "text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-copy"
          )}
        >
          {/* Icon slot: check for 3s, then back to PM icon */}
          <span className={cn(
            "shrink-0 transition-all",
            copied ? "text-emerald-500 dark:text-emerald-400" : pmColors[selected]
          )}>
            {copied ? <Check size={13} strokeWidth={2.5} /> : pmIcons[selected]}
          </span>

          {/* Command text — always visible, never hidden */}
          <span className="truncate max-w-[240px]">{command}</span>
        </button>
        {/* Divider */}
        <div className="w-px h-4 bg-border shrink-0" />

        {/* Right: PM selector */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-1.5 px-2.5 h-full text-[11px] font-sans font-medium text-muted-foreground hover:text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors shrink-0"
        >
          <span className={cn("flex items-center", pmColors[selected])}>
            {pmIcons[selected]}
          </span>
          <span>{pmLabels[selected]}</span>
          <ChevronDown
            size={11}
            className={cn("transition-transform duration-150", open && "rotate-180")}
          />
        </button>
      </div>

      {/* Dropdown — ✅ z-[9999] ensures it's above everything */}
      {open && (
        <div className="absolute top-full right-0 mt-1.5 z-[9999] w-[140px] rounded-lg border bg-popover shadow-lg overflow-hidden py-px">
          {(["npx", "pnpm", "yarn", "bun"] as PackageManager[]).map((pm) => {
            const isActive = selected === pm;
            return (
              <button
                key={pm}
                onClick={() => {
                  setSelected(pm);
                  setOpen(false);
                  setCopied(false); // reset copy state so new command shows immediately
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-[4px] text-[13px] font-sans font-medium transition-colors hover:bg-muted",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span className="flex items-center gap-1">
                  <span className={cn("flex items-center", pmColors[pm])}>
                    {pmIcons[pm]}
                  </span>
                  {pmLabels[pm]}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}



import { Sparkles } from "lucide-react";

const TOOL_STYLES: Record<
  AITool,
  { chip: string; hoverRow: string }
> = {
  claude: {
    chip: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
    hoverRow: "hover:bg-orange-50/70 dark:hover:bg-orange-500/[0.06]",
  },
  v0: {
    chip: "bg-neutral-200 text-neutral-900 dark:bg-neutral-700 dark:text-neutral-100",
    hoverRow: "hover:bg-neutral-100/80 dark:hover:bg-neutral-800/60",
  },
  lovable: {
    chip: "bg-pink-100 text-pink-600 dark:bg-pink-500/10 dark:text-pink-400",
    hoverRow: "hover:bg-pink-50/70 dark:hover:bg-pink-500/[0.06]",
  },
  cursor: {
    chip: "bg-sky-100 text-sky-600 dark:bg-sky-500/10 dark:text-sky-400",
    hoverRow: "hover:bg-sky-50/70 dark:hover:bg-sky-500/[0.06]",
  },
};

function AIPromptDropdown({ slug }: { slug: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<AITool | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const copy = async (tool: AITool) => {
    await navigator.clipboard.writeText(aiPrompts[tool](slug));
    setCopied(tool);
    setTimeout(() => setCopied(null), 1500);
  };

  const labels: Record<AITool, string> = {
    claude: "Claude",
    v0: "v0",
    lovable: "Lovable",
    cursor: "Cursor",
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "group flex items-center gap-1.5 h-8 px-3 rounded-lg border text-[12.5px] font-medium",
          "transition-all duration-200 whitespace-nowrap",
          "border-neutral-200 dark:border-neutral-800",
          "bg-white dark:bg-neutral-950 shadow-sm hover:shadow",
          "text-neutral-600 dark:text-neutral-400",
          "hover:text-neutral-900 dark:hover:text-neutral-100",
          "hover:border-neutral-300 dark:hover:border-neutral-700",
          open &&
            "bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700 shadow"
        )}
      >
        <Sparkles
          size={13}
          className={cn(
            "text-neutral-400 dark:text-neutral-500 transition-colors",
            "group-hover:text-amber-500 dark:group-hover:text-amber-400",
            open && "text-amber-500 dark:text-amber-400"
          )}
        />
        Copy prompt
        <ChevronDown
          size={12}
          className={cn(
            "transition-transform duration-200 text-neutral-400 dark:text-neutral-500",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full right-0 mt-2 z-50 min-w-[140px] px-px",
            "rounded-lg border border-neutral-200/80 dark:border-neutral-800",
            "bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm",
            "shadow-lg shadow-black/5 dark:shadow-black/30",
            "origin-top-right animate-in fade-in-0 zoom-in-95 duration-150"
          )}
        >
          {(["claude", "v0", "lovable", "cursor"] as AITool[]).map((tool) => {
            const style = TOOL_STYLES[tool];
            const isCopied = copied === tool;

            return (
              <button
                key={tool}
                onClick={() => copy(tool)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-2 py-[4.5px] rounded-lg",
                  "text-[13px] font-sans font-medium text-left",
                  "transition-colors duration-150",
                  "text-neutral-700 dark:text-neutral-300",
                  style.hoverRow
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-md shrink-0 transition-transform",
                      style.chip
                    )}
                  >
                    {AIIcons[tool]}
                  </span>
                  {labels[tool]}
                </span>

                <span className="relative flex h-3.5 w-3.5 items-center justify-center shrink-0">
                  <Check
                    size={13}
                    strokeWidth={2.5}
                    className={cn(
                      "absolute text-emerald-500 transition-all duration-200",
                      isCopied ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    )}
                  />
                  <Copy
                    size={12}
                    className={cn(
                      "absolute text-neutral-400 dark:text-neutral-500 transition-all duration-200",
                      isCopied ? "scale-50 opacity-0" : "scale-100 opacity-100"
                    )}
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}



export function Preview({
  children,
  className = "",
  link,
  useIframe = false,
  compact = false,
  comment = [],
  isBlock = false,
  language = "",
  code,
}: PreviewProps) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [fullscreen, setFullscreen] = useState(false);
  const [isExpandCode, setIsExpandCode] = useState(true)
  const slug = link.split("/").pop() ?? link;

  const inner = (
    <div className="p-4 shadow-xs rounded-2xl border bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden">
      <div
        className={cn(
          "w-full rounded-2xl border bg-white dark:bg-black overflow-hidden",
          fullscreen && "h-full flex flex-col",
          className
        )}
      >
        {/* ── Header ── */}
        <div className="rounded-t-2xl flex items-center justify-between gap-3 px-3 py-2 border-b border-border bg-muted/20 z-50 ">
          {/* Left: tabs */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-neutral-100/60 dark:bg-neutral-900/60 border border-border">
            <button
              onClick={() => setTab("preview")}
              className={cn(
                "flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-medium transition-colors",
                tab === "preview"
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <TbEyeSpark size={14} strokeWidth={2} />
              Preview
            </button>

            {/* ✅ Always show Code tab, no code && guard */}
            <button
              onClick={() => setTab("code")}
              className={cn(
                "flex items-center gap-1.5 h-7 px-3 rounded-md text-[12px] font-medium transition-colors",
                tab === "code"
                  ? "bg-background text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <HiOutlineTerminal size={14} strokeWidth={2} />
              Code
            </button>
            
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-2">
            <InstallDropdown slug={slug} />


            <AIPromptDropdown slug={slug} />

          

            <div className="p-[3px] bg-neutral-200/60 dark:bg-neutral-800/60 rounded-[9px] flex items-center justify-center">
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="bg-white dark:bg-neutral-950 flex items-center justify-center w-6 h-6 rounded-[9px] border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {fullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            </button>
            </div>
              {
                !fullscreen && <div className="p-[3px] bg-neutral-200/60 dark:bg-neutral-800/60 rounded-[9px] flex items-center justify-center">
                <button
                    className="bg-white dark:bg-neutral-900/60 flex items-center justify-center w-6 h-6 rounded-[9px] border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  >
                    <ThemeToggle />
                </button>
              </div>
              }
            {fullscreen && (
              <div className="p-[3px] bg-neutral-200/60 dark:bg-neutral-800/60 rounded-[9px] flex items-center justify-center">
                <button
                    className="bg-white dark:bg-neutral-900/60 flex items-center justify-center w-6 h-6 rounded-[9px] border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  >
                    <ThemeToggle />
                </button>
              </div>
            )}
            {fullscreen && (
              <div className="p-[3px] bg-neutral-200/60 dark:bg-neutral-800/60 rounded-[9px] flex items-center justify-center">
                <button
                    onClick={() => setFullscreen(false)}
                    className="bg-white dark:bg-neutral-900/60 flex items-center justify-center w-6 h-6 rounded-[9px] border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-muted"
                  >
                    <X size={13} />
                </button>
              </div>
            )}
            
          </div>
        </div>

        {/* ── Content ── */}
        <div className={cn("rounded-b-2xl w-full h-auto overflow-hidden relative z-50", fullscreen && "relative rounded-2xl flex-1 overflow-hidden")}>
          {/* Preview tab */}
          {tab === "preview" && (
            <>
              {useIframe ? (
                <div className="relative w-full h-full overflow-hidden">
                  <iframe
                    title={link}
                    src={`${prePath}/preview/${link}`}
                    className="w-full h-full overflow-y-auto list-none"
                    style={{ border: "none" }}
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    "flex justify-center items-center not-prose",
                    isBlock ? "" : "p-6 md:p-10",
                    fullscreen ? "h-screen" : compact ? "min-h-[120px]" : "min-h-[500px]"
                  )}
                >
                  {children}
                </div>
              )}
            </>
          )}

          {/* Code tab — ✅ no && code guard, handles missing code gracefully */}
          {tab === "code" && (
            <div className={`relative group`}>
              {code ? (
                <>
                  <div className="absolute top-2 right-5 z-10 flex gap-px items-center justify-center border bg-white dark:bg-black rounded-[9px] px-2">
                    <span><CopyButton text={code} /></span>
                  </div>
                  <Suspense fallback={
                    <pre className="overflow-x-auto px-2 text-[15px] leading-relaxed font-mono font-medium text-foreground max-h-[500px] overflow-y-auto">
                      <code>{code}</code>
                    </pre>
                  }>
                    <CodeHighlight code={code} language={language ?? "tsx"} />
                  </Suspense>
                </>
              ) : (
                <div className="flex items-center justify-center min-h-[200px] text-sm text-muted-foreground">
                  No code provided for this Component.
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );

  if (fullscreen) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          onClick={() => setFullscreen(false)}
        />
        {/* Fullscreen panel */}
        <div className="fixed inset-4 z-50 rounded-2xl border border-border bg-background overflow-hidden shadow-2xl flex flex-col py-10">
          {inner}
        </div>
      </>
    );
  }

  return (
    <div className="my-6 not-prose py-10">
      {inner}
      {comment.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {comment.map((text, i) => (
            <span
              key={i}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-muted text-muted-foreground"
            >
              {text}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}


// components/code-highlight.tsx
import { codeToHtml } from "shiki";

export async function CodeHighlight({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) {
  const html = await codeToHtml(code, {
    lang: language,
    themes: { 
      light: "one-dark-pro", 
      dark: "one-dark-pro" 
    }
  });

  return (
    <div
      style={{ fontFamily: "'Geist Mono', 'Geist Mono Fallback', monospace" }}
      className="[&>pre]:overflow-x-auto [&>pre]:p-5 [&>pre]:text-[14px] [&>pre]:leading-normal [&>pre]:font-bold [&>pre]:max-h-[500px] [&>pre]:overflow-y-auto [&_code]:bg-transparent [&>pre]:![font-family:inherit]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}



export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 text-muted-foreground hover:text-foreground transition-colors"
      title="Copy code"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}