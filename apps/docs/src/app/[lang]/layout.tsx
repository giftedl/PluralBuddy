import { RootProvider } from "fumadocs-ui/provider/next";
import "../global.css";
import { Inter } from "next/font/google";
import { Body } from "@/components/body";
import { Html } from "@/components/html";
import { Toaster } from "@/components/ui/sonner";
import { Viewport } from "next";
import { i18nUI } from "@/lib/layout.shared";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({
	subsets: ["latin"],
});

export const viewport: Viewport = {
	themeColor: "#fccee8",
};

export default async function Layout({
	children,
	params,
}: LayoutProps<"/[lang]">) {
	const lang = (await params).lang;

	return (
		<Html>
			<Body>
				<RootProvider
					theme={{
						enabled: true,
					}}
					i18n={i18nUI.provider(lang)}
				>
					<NextIntlClientProvider>
						{children}
						<Toaster position="bottom-right" />
					</NextIntlClientProvider>
				</RootProvider>
			</Body>
		</Html>
	);
}
