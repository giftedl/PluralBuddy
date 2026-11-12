import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export default async function Layout({ children }: LayoutProps<"/">) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NuqsAdapter>{children}</NuqsAdapter>
    </ThemeProvider>
  );
}
