import { SolarPicture } from "@/components/solar-picture";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Link from "next/link";

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
