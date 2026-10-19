"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

const queryClient = new QueryClient();

export function Body({
	children,
}: {
	children: ReactNode;
}): React.ReactElement {
	const mode = useMode();

	return (
		<body className={cn(mode, "relative flex min-h-screen flex-col branding-blue")}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</body>
	);
}

export function useMode(): string | undefined {
	const { slug } = useParams();
	return Array.isArray(slug) && slug.length > 0 ? slug[0] : undefined;
}
