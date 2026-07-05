"use client";

import React, { Suspense, useState } from "react";

import { CodeHighlight } from "./preview";
import { Check, Copy, Terminal, FileCode2 } from "lucide-react";


/* ------------------------------------------------------------------ */
/* CopyButton — self-contained, animated check state, no dependency   */
/* on an external component so its styling is fully controlled here. */
/* ------------------------------------------------------------------ */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — fail silently
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy code"}
      className={
        "group relative flex h-7 w-7 items-center justify-center rounded-lg border " +
        "border-neutral-200 dark:border-neutral-700 " +
        "bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm " +
        "shadow-sm hover:shadow transition-all duration-200 " +
        "hover:border-neutral-300 dark:hover:border-neutral-600 " +
        "hover:bg-neutral-50 dark:hover:bg-neutral-800 " +
        "active:scale-90"
      }
    >
      <Check
        className={
          "absolute h-3.5 w-3.5 text-emerald-500 transition-all duration-200 " +
          (copied ? "scale-100 opacity-100" : "scale-50 opacity-0")
        }
      />
      <Copy
        className={
          "h-3.5 w-3.5 text-neutral-500 dark:text-neutral-400 transition-all duration-200 " +
          "group-hover:text-neutral-700 dark:group-hover:text-neutral-200 " +
          (copied ? "scale-50 opacity-0" : "scale-100 opacity-100")
        }
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* CodeBlock — rounded, soft-shadowed, header carries filename +      */
/* language badge + copy button as normal flow (no absolute overlap). */
/* ------------------------------------------------------------------ */

function CodeBlock({
  code,
  language = "tsx",
  fileName,
}: {
  code: string;
  language?: string;
  fileName?: string;
}) {
  if (!code) return null;

  return (
    <div
      className={
        "group/block overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 " +
        "bg-white dark:bg-neutral-950 shadow-sm hover:shadow-md " +
        "transition-shadow duration-300"
      }
    >
      <div
        className={
          "flex items-center justify-between gap-3 border-b border-neutral-200/80 dark:border-neutral-800 " +
          "bg-gradient-to-b from-neutral-50 to-neutral-50/60 dark:from-neutral-900 dark:to-neutral-900/60 " +
          "px-4 py-2.5"
        }
      >
        <div className="flex min-w-0 items-center gap-2">
          {fileName ? (
            <FileCode2 className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
          ) : (
            <Terminal className="h-3.5 w-3.5 shrink-0 text-neutral-400 dark:text-neutral-500" />
          )}
          <span className="truncate font-mono text-[12.5px] text-neutral-500 dark:text-neutral-400">
            {fileName ?? "Terminal"}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-md bg-neutral-200/60 dark:bg-neutral-800 px-2 font-sans text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
            {language}
          </span>
          <CopyButton text={code} />
        </div>
      </div>

      <Suspense
        fallback={
          <pre className="overflow-x-auto px-4 py-4 text-[13px] leading-relaxed font-mono font-medium text-foreground max-h-[500px] overflow-y-auto">
            <code>{code}</code>
          </pre>
        }
      >
        <CodeHighlight code={code} language={language} />
      </Suspense>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step — soft circular numeral, shadow, gradient connecting line     */
/* ------------------------------------------------------------------ */

function Step({
  index,
  isLast,
  title,
  children,
}: {
  index: number;
  isLast: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex gap-4 not-prose">
      <div className="flex flex-col items-center">
        <div
          className={
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full " +
            "border border-neutral-200 dark:border-neutral-700 " +
            "bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 " +
            "text-[13px] font-semibold font-sans text-neutral-700 dark:text-neutral-200 " +
            "shadow-sm"
          }
        >
          {index}
        </div>
        {!isLast ? (
          <div className="mt-1.5 w-px flex-1 bg-gradient-to-b from-neutral-200 to-transparent dark:from-neutral-800" />
        ) : null}
      </div>
      <div className={"min-w-0 flex-1 " + (isLast ? "pb-0.5" : "pb-9")}>
        <p className="mb-3 text-[15px] font-semibold font-sans tracking-tight text-neutral-900 dark:text-neutral-100">
          {title}
        </p>
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ManualInstallation — the reusable block you drop into any .mdx     */
/* ------------------------------------------------------------------ */

export interface ManualInstallationProps {
  /** e.g. "motion clsx tailwind-merge" */
  dependencies: string;
  packageManager?: "npm" | "pnpm" | "yarn" | "bun";

  /** Defaults to lib/utils.ts — pass null/omit utilsCode to skip this step. */
  utilsFileName?: string | null;
  utilsCode?: string;

  /** e.g. "components/ui/draggable-card.tsx" */
  componentFileName: string;
  componentCode: string;
  language?: string;
}

const installCmd: Record<NonNullable<ManualInstallationProps["packageManager"]>, string> = {
  npm: "npm i",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
};

export function ManualInstallation({
  dependencies,
  packageManager = "npm",
  utilsFileName = "lib/utils.ts",
  utilsCode,
  componentFileName,
  componentCode,
  language = "tsx",
}: ManualInstallationProps) {
  const steps: { title: string; content: React.ReactNode }[] = [
    {
      title: "Install dependencies",
      content: (
        <CodeBlock
          code={`${installCmd[packageManager]} ${dependencies}`}
          language="bash"
        />
      ),
    },
  ];

  if (utilsFileName && utilsCode) {
    steps.push({
      title: "Add the util file",
      content: <CodeBlock code={utilsCode} language="ts" fileName={utilsFileName} />,
    });
  }

  steps.push({
    title: "Copy the source code",
    content: (
      <CodeBlock code={componentCode} language={language} fileName={componentFileName} />
    ),
  });

  return (
    <div className="mt-10 pb-5  ">
      {steps.map((step, i) => (
        <Step key={step.title} index={i + 1} isLast={i === steps.length - 1} title={step.title}>
          {step.content}
        </Step>
      ))}
    </div>
  );
}

export default ManualInstallation;