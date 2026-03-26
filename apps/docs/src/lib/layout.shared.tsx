import { SolarPicture } from "@/components/solar-picture";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Link from "next/link";
import { i18n } from "@/lib/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";

export const i18nUI = defineI18nUI(i18n, {
	translations: {
		en: {
			displayName: "English",
		},
		pt: {
			displayName: "Portuguese",
		},
		de: {
			displayName: "German",
		},
	},
});

export function baseOptions(): BaseLayoutProps {
	return {
		nav: {
			title: (
				<Link href="/" className="flex items-center gap-2">
					<SolarPicture />
					PluralBuddy
				</Link>
			),
		},
	};
}
