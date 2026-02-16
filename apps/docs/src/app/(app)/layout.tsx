"use client";

import { Footer } from "@/components/footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";

const queryClient = new QueryClient();

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<QueryClientProvider client={queryClient}>
			<div className="p-2 h-14 w-full bg-card border px-4 fixed z-100">
				<div className="flex flex-row items-center float-right">
					<ThemeToggle />
				</div>
			</div>
			<NextTopLoader />
			<div className="min-h-screen">{children}</div>
			<Footer />
		</QueryClientProvider>
	);
}
