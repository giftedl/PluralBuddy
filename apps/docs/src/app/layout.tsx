import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { Inter } from "next/font/google";
import { Body } from "@/components/body";
import { Html } from "@/components/html";

const inter = Inter({
	subsets: ["latin"],
});

export default function Layout({ children }: LayoutProps<"/">) {
	return (
		<Html>
			<Body>
				<RootProvider
					theme={{
						enabled: true,
					}}
				>
					{children}
				</RootProvider>
			</Body>
		</Html>
	);
}
