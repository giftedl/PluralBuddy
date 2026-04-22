import { SolarPicture } from "@/components/solar-picture";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Link from "next/link";
import { i18n } from "@/lib/i18n";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { Suspense } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
				<span className="flex items-center gap-2">
					<Suspense
						fallback={
							<Avatar>
								<AvatarImage src="/image/solar-centered.png" />
								<AvatarFallback>Solar</AvatarFallback>
							</Avatar>
						}
					>
						<SolarPicture />
					</Suspense>
					PluralBuddy
				</span>
			),
		},
	};
}
