import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { Body } from "@/components/body";

const inter = Inter({
	subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<html lang="en" className={inter.className} suppressHydrationWarning>
			<Body>
				<RootProvider
					theme={{
						enabled: true,
					}}
				>
					{children}
				</RootProvider>
			</Body>
		</html>
	);
}
