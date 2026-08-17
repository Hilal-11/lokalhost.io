"use client";

import { ThemeProvider } from "@/components/provider/theme-provider";
import { RootProvider } from "fumadocs-ui/provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <RootProvider>
          {children}
        </RootProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}