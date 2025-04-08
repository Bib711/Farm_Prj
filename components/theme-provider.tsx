"use client"
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force the theme provider to only render on the client to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  // If not mounted yet, render a div as a placeholder to preserve layout
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}>{children}</div>;
  }
  
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

