import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { Body } from "@/components/body";
import { Html } from "@/components/html";
import { ClerkProvider } from "@clerk/nextjs";
import {
	useQuery,
	useMutation,
	useQueryClient,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";

const inter = Inter({
	subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<Html>
			<Body>
				<ClerkProvider>
					<RootProvider
						theme={{
							enabled: true,
						}}
					>
							{children}
					</RootProvider>
				</ClerkProvider>
			</Body>
		</Html>
	);
}
