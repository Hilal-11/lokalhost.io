import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { backgroundsource } from '@/lib/source';
import { baseOptions, baseOptions2 } from '@/app/layout.config';
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
 
          <DocsLayout tabMode='auto' tree={backgroundsource.pageTree}
            {...baseOptions}
             sidebar={{
              defaultOpenLevel: 1,
              className: "bg-white dark:bg-black border-r border-border",
            }}
          >
             {children}
          </DocsLayout>

  );
}

