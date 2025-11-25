/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

"use client";

import { cn } from "@/lib/cn";
import { useTheme } from "next-themes";
import { Inter } from "next/font/google";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";

const inter = Inter({
	subsets: ["latin"],
});

export function Html({
    children,
  }: {
    children: ReactNode;
  }): React.ReactElement {
    const mode = useMode();
    const { resolvedTheme } = useTheme()
  
    return (
      <html lang="en" id={mode} className={cn(inter.className, resolvedTheme)} suppressHydrationWarning>
        {children}
      </html>
    );
  }

  export function useMode(): string | undefined {
    const { slug } = useParams();
    return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
  }
  