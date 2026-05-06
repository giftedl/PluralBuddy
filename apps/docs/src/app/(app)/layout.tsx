import { Body } from "@/components/body";
import "../global.css";
import { Footer } from "@/components/footer";
import { Html } from "@/components/html";
import { ThemeToggle } from "@/components/theme-toggle";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { i18nUI } from "@/lib/layout.shared";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import NextTopLoader from "nextjs-toploader";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "next-themes";
import { AuthComponents } from "@/components/layout/docs/auth-components";
import { Button } from "@/components/ui/shadcn-button";
import { Cog, PanelRightOpen } from "lucide-react";
import { AppSettings } from "@/components/app/app-settings";
import { SerwistProvider } from "@serwist/turbopack/react";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { RemoteSidebarToggle } from "@/components/app/remote-sidebar-toggle";
import { Metadata } from "next";


const APP_NAME = "PluralBuddy App";
const APP_DEFAULT_TITLE = "PluralBuddy App";
const APP_TITLE_TEMPLATE = "%s - PluralBuddy App";
const APP_DESCRIPTION = "PluralBuddy App";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default async function Layout({ children }: LayoutProps<"/[lang]">) {
	const messages = (await import(`../../../messages/en.json`)).default;

	return (
		<Html>
			<Body>
				<TooltipProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<NextIntlClientProvider locale="en" messages={messages}>
							<NuqsAdapter>{children}</NuqsAdapter>

							<Toaster position="bottom-right" />
						</NextIntlClientProvider>
					</ThemeProvider>
				</TooltipProvider>
			</Body>
		</Html>
	);
}
