import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, RouterProvider, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ChevronDown, Container, LogIn, Settings, SwatchBook, UserGroup } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { AppTopbar } from "#/components/top-bar.tsx";
import { Button } from "#/components/ui/button";
import { Discord } from "#/components/ui/discord";
import { Separator } from "#/components/ui/separator";
import { useAuth } from "#/hooks/use-auth";
import appCss from "../styles.css?url";
import { AuthenticationProvider } from "#/logic/auth-ctx";
import { SidebarProvider } from "#/components/sidebar";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "PluralBuddy Central",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
});

export const queryClient = new QueryClient();

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ThemeProvider defaultTheme="dark" attribute="class" enableSystem disableTransitionOnChange>
        <head>
          <HeadContent />
          <Scripts />
        </head>
        <body className="font-sans antialiased ">
          <QueryClientProvider client={queryClient}>
            <AuthenticationProvider>
              <AppTopbar />
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </AuthenticationProvider>
          </QueryClientProvider>
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </body>
      </ThemeProvider>
    </html>
  );
}
