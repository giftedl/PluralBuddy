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
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { RemoteSidebarToggle } from "@/components/app/remote-sidebar-toggle";

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
