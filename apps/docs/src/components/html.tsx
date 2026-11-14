/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

"use client";

import { Inter } from "next/font/google";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { getLocale, getTextDirection } from "@/paraglide/runtime";

const inter = Inter({
  subsets: ["latin"],
});

export function Html({ children }: { children: ReactNode }): React.ReactElement {
  const mode = useMode();
  const { resolvedTheme } = useTheme();

  return (
    <html
      id={mode}
      className={cn(inter.className, resolvedTheme)}
      suppressHydrationWarning
      lang={getLocale()}
      dir={getTextDirection()}
    >
      {children}
    </html>
  );
}

export function useMode(): string | undefined {
  const { slug } = useParams();
  return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
}
