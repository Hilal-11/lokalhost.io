"use client";

import React from "react";
import { useState } from "react";

export interface PropRow {
  name: string;
  type: string;
  description: string;
  required?: boolean;
}

export interface PropsTableProps {
  rows: PropRow[];
  className?: string;
}

/* Single neutral pill style — light bg on light theme, dark bg on     */
/* dark theme. No hue variation between values.                       */
const PILL_STYLE =
  "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 rounded-sm";

/** Detects `"a" | "b" | "c"` style literal unions so they render as pills. */
function parseLiteralUnion(type: string): string[] | null {
  const parts = type.split("|").map((p) => p.trim());
  const isLiteralUnion = parts.length > 1 && parts.every((p) => /^".*"$/.test(p));
  return isLiteralUnion ? parts.map((p) => p.slice(1, -1)) : null;
}

function TypeCell({ type }: { type: string }) {
  const union = parseLiteralUnion(type);

  if (union) {
    return (
      <div className="flex flex-wrap gap-1">
        {union.map((value) => (
          <span
            key={value}
            className={
              "inline-flex items-center rounded-sm border px-1.5 text-[11px] font-sans font-medium " +
              PILL_STYLE
            }
          >
            {value}
          </span>
        ))}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center rounded-sm px-1.5 text-[12px] font-sans break-words bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300">
      {type}
    </span>
  );
}

export default function PropsTable({ rows, className = "" }: PropsTableProps) {
  const [propsExpand , setPropsExpand] = useState(false)
  return (
    <div className="relative pb-10">
    <button className="absolute bottom-0 z-50 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-lg text-xs font-mono font-bold tracking-widest bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm hover:opacity-90 transition-opacity duration-200" onClick={() => setPropsExpand(!propsExpand)}>
      {propsExpand ? "collapse props" : "expand props"}
    </button>
    <div
      className={
        `${propsExpand ? "h-auto" : "mask-b-from-60% to-96% max-h-[600px]"} relative not-prose w-full overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-950`+
        className
      }
      data-slot="props-table"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left font-sans">
          <thead>
            <tr className="border-b border-neutral-200/80 dark:border-neutral-800 bg-gradient-to-b from-neutral-50 to-neutral-50/60 dark:from-neutral-900 dark:to-neutral-900/60">
              <th className="w-[20%] border-r border-neutral-200/70 dark:border-neutral-800 px-5 py-3 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Prop
              </th>
              <th className="w-[32%] border-r border-neutral-200/70 dark:border-neutral-800 px-5 py-3 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Type
              </th>
              <th className="px-5 py-3 text-sm font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.name}
                className={
                  "transition-colors hover:bg-neutral-50/80 dark:hover:bg-neutral-900/40 " +
                  (i !== rows.length - 1
                    ? "border-b border-neutral-200/60 dark:border-neutral-800/60"
                    : "")
                }
              >
                <td className="border-r border-neutral-200/60 dark:border-neutral-800/60 px-5 py-3.5 align-top">
                  <span className="inline-flex items-center gap-1 rounded-sm bg-neutral-100 dark:bg-neutral-800 px-1.5 font-sans text-[13px] font-medium text-neutral-800 dark:text-neutral-100">
                    {row.name}
                    {row.required ? (
                      <span className="text-rose-500" title="Required">
                        *
                      </span>
                    ) : null}
                  </span>
                </td>
                <td className="border-r border-neutral-200/60 dark:border-neutral-800/60 px-5 py-3.5 align-top">
                  <TypeCell type={row.type} />
                </td>
                <td className="px-5 font-sans font-medium py-3.5 align-top text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}