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
							<NuqsAdapter>
								<div className="p-2 h-14 w-full bg-card border px-4 fixed z-50">
									<div className="flex flex-row items-center float-right">
										<ThemeToggle />
									</div>
								</div>
								<div className="min-h-screen">{children}</div>
								<Footer />
							</NuqsAdapter>

							<Toaster position="bottom-right" />
						</NextIntlClientProvider>
					</ThemeProvider>
				</TooltipProvider>
			</Body>
		</Html>
	);
}
