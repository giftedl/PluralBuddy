import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRoute,
	HeadContent,
	RouterProvider,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { LogIn } from "lucide-react";
import { ThemeProvider } from "next-themes";
import { AppTopbar } from "#/components/top-bar.tsx";
import { Button } from "#/components/ui/button";
import { Discord } from "#/components/ui/discord";
import { Separator } from "#/components/ui/separator";
import appCss from "../styles.css?url";

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
			<ThemeProvider
				defaultTheme="dark"
				attribute="class"
				enableSystem
				disableTransitionOnChange
			>
				<head>
					<HeadContent />
				</head>
				<body className="font-sans antialiased ">
					<QueryClientProvider client={queryClient}>
						<AppTopbar />
						<main className="pt-[57px] flex w-full">
							<div className="p-4 min-w-[300px] flex flex-col gap-2">
								<div className="flex items-center gap-2 text-muted-foreground text-xs px-3">
									<span className="shrink-0">You</span>
									<Separator className="shrink" />
								</div>
								<div className="flex flex-col gap-1">
									<Button
										className="w-full text-left flex items-center justify-start gap-2"
										variant="tertiary"
										rounding="xl"
									>
										<LogIn size={16} />
										Log in
									</Button>
									<Button
										className="w-full text-left flex items-center justify-start gap-2"
										variant="tertiary"
										rounding="xl"
									>
										<Discord className="size-4 fill-primary" />
										Invite PluralBuddy
									</Button>
								</div>
							</div>
							{children}
						</main>
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
					<Scripts />
				</body>
			</ThemeProvider>
		</html>
	);
}
