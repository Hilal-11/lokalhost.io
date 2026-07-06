
"use client"
import React from 'react'
import { cn } from "@/lib/utils";
import { FaApple } from "react-icons/fa";
import { DiWindows } from "react-icons/di";
import { FcLinux } from "react-icons/fc";
import DownloadButtonGroup from "@/components/lokalhost_io/buttons/download-button";
import Link from 'next/link';
import { ComponentPreview } from '@/components/lokalhost_io/code-blocks/component-preview';
import CodeBlock from "@/components/lokalhost_io/code-blocks/code-block";

const DownloadButton = () => (
  <div className="flex flex-col gap-2.5 w-full px-4 justify-center items-center">
    <DownloadButtonGroup
      config={{
                windows: { downloadUrl: ""},
              }}
                            buttonProps={{
                              label: "Download For Windows",
                              icon: <DiWindows size={20} />,
                              iconPosition: "right",
                            }}
                            size="md"
      platforms={['windows']}
    /> 
    <DownloadButtonGroup
    config={{
                linux: { downloadUrl: ""},
              }}
                            buttonProps={{
                              label: "Download For Linux",
                              icon: <FcLinux size={20} />,
                              iconPosition: "right",
                            }}
                            wrapperColorClassName="bg-blue-400"
                            colorClassName="bg-blue-500"
                            size="md"
    platforms={['linux']}
  /> 
  <DownloadButtonGroup
              config={{
                              mac: { downloadUrl: ""},
                            }}
                            buttonProps={{
                              label: "Download For Mac",
                              icon: <FaApple size={20} />,
                              iconPosition: "right",
                            }}
                            wrapperColorClassName="bg-yellow-400"
                            colorClassName="bg-yellow-500"
                            size="md"
              platforms={['mac']}
            />
  </div>
);


const CodePreviewComponent = () => (
  <div className="flex justify-center items-center p-10">
  <ComponentPreview
          code={` function InstallDropdown({ slug }: { slug: string }) {
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
  };`}
          language="tsx"
          frameClassName="bg-neutral-100 dark:bg-neutral-900"
          lightTheme="catppuccin-latte"
          darkTheme="tokyo-night"
          maxCodeHeight={400}
          showLineNumbers={true}
        >
  </ComponentPreview>
  </div>
);

const CodeBlockComponent = () => (
  <div className="flex flex-col gap-2 w-full px-4">
    <CodeBlock
        code={`import { z } from 'zod';
import { createMcpHandler } from 'mcp-handler';
 
const handler = createMcpHandler(
  (server) => {
    server.tool(
      'roll_dice',
      'Rolls an N-sided die',
      { sides: z.number().int().min(2) },
      async ({ sides }) => {
        const value = 1 + Math.floor(Math.random() * sides);
        return {
          content: [{ type: 'text', text: \`🎲 You rolled a ${10}!\` }],
        };
      },
    );
  },
  {},
  { basePath: '/api' },
);`}
        fileName="app/api/mcp/route.ts"
        language="ts"
        showLineNumbers
      />
  </div>
);

const SkeletonForm = () => (
  <div className="flex flex-col gap-2.5 w-full px-4">
    <div className="h-1.5 w-1/4 rounded-full bg-neutral-300 dark:bg-neutral-700" />
    <div className="h-8 w-full rounded-md bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800" />
    <div className="h-1.5 w-1/3 rounded-full bg-neutral-300 dark:bg-neutral-700 mt-1" />
    <div className="h-8 w-full rounded-md bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-800" />
    <div className="h-7 w-full rounded-md bg-neutral-800 dark:bg-neutral-700 mt-1" />
  </div>
);

const SkeletonTable = () => (
  <div className="flex flex-col gap-0 w-full px-4 overflow-hidden">
    <div className="flex gap-2 pb-2 border-b border-neutral-200 dark:border-neutral-800">
      {[2, 3, 2].map((w, i) => (
        <div key={i} className={`h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700 flex-${w}`} style={{ flex: w }} />
      ))}
    </div>
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex gap-2 py-2 border-b border-neutral-100 dark:border-neutral-800/50">
        <div className="h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800" style={{ flex: 2 }} />
        <div className="h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800/40" style={{ flex: 3 }} />
        <div className="h-5 w-12 rounded-full bg-neutral-200 dark:bg-neutral-800" style={{ flex: 2 }} />
      </div>
    ))}
  </div>
);

const SkeletonModal = () => (
  <div className="flex flex-col w-full px-4">
    <div className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div className="h-2 w-1/3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <div className="h-1.5 w-full rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="h-1.5 w-4/5 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
        <div className="h-1.5 w-2/3 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
      </div>
      <div className="px-4 pb-3 flex gap-2 justify-end">
        <div className="h-6 w-14 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700" />
        <div className="h-6 w-14 rounded-md bg-neutral-800 dark:bg-neutral-600" />
      </div>
    </div>
  </div>
);

const SkeletonNavbar = () => (
  <div className="flex flex-col gap-3 w-full px-2">
    <div className="w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-2.5 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-md bg-neutral-800 dark:bg-neutral-600" />
        <div className="h-2 w-16 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <div className="hidden md:flex gap-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-1.5 w-8 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
      <div className="h-6 w-16 rounded-full bg-neutral-800 dark:bg-neutral-700" />
    </div>
    <div className="flex flex-col gap-1.5 px-2">
      <div className="h-1.5 w-2/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="h-1.5 w-3/5 rounded-full bg-neutral-100 dark:bg-neutral-800/50" />
    </div>
  </div>
);

const SkeletonBadge = () => (
  <div className="flex flex-col gap-3 w-full items-center px-4">
    <div className="flex flex-wrap gap-2 justify-center">
      {["rounded-full bg-neutral-800 dark:bg-neutral-700 w-16", "rounded-full bg-neutral-200 dark:bg-neutral-800 w-20", "rounded-full bg-neutral-300 dark:bg-neutral-800 w-14"].map((cls, i) => (
        <div key={i} className={`h-5 ${cls}`} />
      ))}
    </div>
    <div className="flex flex-wrap gap-2 justify-center">
      {["rounded-md bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 w-24", "rounded-md bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 w-16"].map((cls, i) => (
        <div key={i} className={`h-6 ${cls}`} />
      ))}
    </div>
    <div className="flex gap-1.5 flex-wrap justify-center">
      {[12, 16, 10, 14].map((w, i) => (
        <div key={i} className="h-4 rounded-full bg-neutral-200 dark:bg-neutral-800" style={{ width: `${w * 4}px` }} />
      ))}
    </div>
  </div>
);

const SkeletonToast = () => (
  <div className="flex flex-col gap-2 w-full px-3">
    {[
      "border-l-4 border-emerald-400 bg-white dark:bg-neutral-900",
      "border-l-4 border-neutral-400 dark:border-neutral-600 bg-white dark:bg-neutral-900",
      "border-l-4 border-neutral-600 dark:border-neutral-500 bg-white dark:bg-neutral-900",
    ].map((cls, i) => (
      <div key={i} className={cn("w-full rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-2 flex items-center gap-2.5 shadow-sm", cls)}>
        <div className="w-3.5 h-3.5 rounded-full bg-neutral-200 dark:bg-neutral-700 shrink-0" />
        <div className="flex flex-col gap-1 flex-1">
          <div className="h-1.5 w-1/3 rounded-full bg-neutral-300 dark:bg-neutral-700" />
          <div className="h-1.5 w-3/5 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    ))}
  </div>
);

const SkeletonPricing = () => (
  <div className="flex gap-2.5 w-full px-3">
    {[false, true].map((highlighted, i) => (
      <div key={i} className={cn("flex-1 rounded-xl p-3 flex flex-col gap-2 border", highlighted ? "bg-neutral-900 dark:bg-neutral-100 border-neutral-800 dark:border-neutral-200" : "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800")}>
        <div className={cn("h-1.5 w-1/2 rounded-full", highlighted ? "bg-neutral-600 dark:bg-neutral-400" : "bg-neutral-200 dark:bg-neutral-700")} />
        <div className={cn("h-4 w-3/4 rounded-md", highlighted ? "bg-neutral-700 dark:bg-neutral-300" : "bg-neutral-200 dark:bg-neutral-800")} />
        <div className="flex flex-col gap-1 mt-1">
          {[...Array(3)].map((_, j) => (
            <div key={j} className={cn("h-1.5 rounded-full", highlighted ? "bg-neutral-700 dark:bg-neutral-300" : "bg-neutral-100 dark:bg-neutral-800/50", j === 0 ? "w-4/5" : j === 1 ? "w-3/5" : "w-2/3")} />
          ))}
        </div>
        <div className={cn("h-6 w-full rounded-lg mt-1", highlighted ? "bg-white dark:bg-neutral-900" : "bg-neutral-800 dark:bg-neutral-700")} />
      </div>
    ))}
  </div>
);

const SkeletonAvatar = () => (
  <div className="flex flex-col gap-3 items-center w-full px-4">
    <div className="flex items-center -space-x-2">
      {["bg-neutral-300 dark:bg-neutral-700", "bg-neutral-400 dark:bg-neutral-600", "bg-neutral-600 dark:bg-neutral-500", "bg-neutral-800 dark:bg-neutral-400"].map((cls, i) => (
        <div key={i} className={cn("w-9 h-9 rounded-full border-2 border-white dark:border-neutral-900", cls)} />
      ))}
      <div className="w-9 h-9 rounded-full border-2 border-white dark:border-neutral-900 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <span className="text-[8px] font-mono font-bold text-neutral-500">+8</span>
      </div>
    </div>
    <div className="flex gap-3 items-center">
      <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800" />
      <div className="flex flex-col gap-1.5">
        <div className="h-2 w-20 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <div className="h-1.5 w-14 rounded-full bg-neutral-100 dark:bg-neutral-800/60" />
      </div>
    </div>
  </div>
);

const SkeletonInput = () => (
  <div className="flex flex-col gap-2.5 w-full px-4">
    {[
      { label: "w-1/4", style: "rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950" },
      { label: "w-1/3", style: "rounded-full border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900" },
    ].map(({ label, style }, i) => (
      <div key={i} className="flex flex-col gap-1">
        <div className={cn("h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-700", label)} />
        <div className={cn("h-8 w-full px-3 flex items-center gap-2", style)}>
          <div className="h-1.5 w-1/2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>
      </div>
    ))}
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 rounded border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 shrink-0" />
      <div className="h-1.5 w-2/3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
    </div>
  </div>
);

// ─── Skeleton map ─────────────────────────────────────────────────────────────
const SKELETONS = [
  { component: DownloadButton,    label: "Download Button", link: "docs/components/buttons/download-button"     },
  { component: CodePreviewComponent,  label: "Code Preview" , link: "docs/components/code-blocks/component-preview"   },
  { component: CodeBlockComponent,   label: "Code-Block" , link: "docs/components/code-blocks/code-block"    },
  { component: SkeletonForm,    label: "Form" , link: "/"     },
  { component: SkeletonTable,   label: "Table" , link: "/"    },
  { component: SkeletonModal,   label: "Modal" , link: "/"    },
  { component: SkeletonNavbar,  label: "Navbar" , link: "/"   },
  { component: SkeletonBadge,   label: "Badge" , link: "/"    },
  { component: SkeletonToast,   label: "Toast" , link: "/"    },
  { component: SkeletonPricing, label: "Pricing", link: "/"   },
  { component: SkeletonAvatar,  label: "Avatar", link: "/"    },
  { component: SkeletonInput,   label: "Input" , link: "/"    },
];

// ─── Main component ───────────────────────────────────────────────────────────
function ComponentsList() {
  return (
    <div className="w-full container max-w-[1580px] relative pb-8">
      <div className="w-full">

        {/* ── Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 py-5 gap-5">
          {SKELETONS.map(({ component: Skeleton, label, link }, index) => (
            <Link key={index} href={link} className="no-underline">
            <div
              key={index}
              className={cn(
                "cursor-pointer group relative w-full lg:h-[260px] h-[250px] rounded-xl",
                "bg-white dark:bg-neutral-950",
                "border border-neutral-200 dark:border-neutral-800",
                "shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.04)]",
                "dark:shadow-[0_1px_3px_rgba(0,0,0,0.3)]",
                "overflow-hidden flex flex-col",
                "hover:border-neutral-300 dark:hover:border-neutral-700"
              )}
            >
              {/* skeleton preview area */}
              <div className="flex-1 flex items-center justify-center overflow-hidden relative">
                {/* subtle inner bg texture */}
                <Skeleton />
              </div>
              {/* Label footer */}
              <div className="shrink-0 h-[44px] px-4 border-t border-neutral-100 dark:border-neutral-800/80 bg-neutral-100 dark:bg-neutral-950 flex items-center justify-between">
                <span className="text-sm font-sans font-semibold text-neutral-500 dark:text-neutral-500 no-underline">
                  {label}
                </span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </div>


    </div>
  );
}
export default ComponentsList

