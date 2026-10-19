import { ActionRow, Button, Container } from "@dressed/react";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import {
	ChevronRight,
	ExternalLink,
} from "lucide-react";
import { Metadata, Viewport } from "next";
import Link from "next/link";
import type { JSX } from "react";
import { DressedEmbedLayout } from "@/components/dressed-embed-layout";
import { SolarPicture } from "@/components/solar-picture";
import { Ripple } from "@/components/ui/ripple";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { cn } from "@/lib/cn";
import { correctSSRLocale } from "@/lib/correct-locale";
import { m } from "@/paraglide/messages.js";
import { getRealisticAbout } from "@/server/get-realistic-about";
import { DynamicHighligher, Hero } from "./page.client";
import "@fontsource/mona-sans/400.css";
import "@fontsource/mona-sans/600.css";
import { FinalRemark } from "@/components/marketing-home/final-remark";
import { buttonVariants, MarketingHomeHero } from "@/components/marketing-home/hero";
import { MarketingHomeIntegrationSection } from "@/components/marketing-home/integration-section";
import { MarketingHomeMoreSection } from "@/components/marketing-home/more-section";
import { MarketingHomeServerSection } from "@/components/marketing-home/server-section";
import { MarketingHomeShowcase } from "@/components/marketing-home/showcase";
import { MarketingHomeUserSection } from "@/components/marketing-home/user-section";

// export const metadata: Metadata = {
// 	title: "PluralBuddy",
// 	description: "The new age of plurality data storage for Discord and beyond. Create alters & tags to spice up your system for those who are plural.",
// 	applicationName: "PluralBuddy",
// };

export const viewport: Viewport = {
	themeColor: "#fccee8",
};

export const metadata: Metadata = {
	title: "PluralBuddy – The plurality bot finally built correctly"
}

export default async function HomePage() {
	await correctSSRLocale();

	return (
		<div className="bg-surface-2 justify-center text-center flex-1 bg-mantle">
			<DressedEmbedLayout>
				<Container accent_color={0xfccee8}>
					{await getRealisticAbout()}
					<ActionRow>
						<Button url="https://gftl.fyi/invite" label="Invite PluralBuddy" />
					</ActionRow>
				</Container>
			</DressedEmbedLayout>
			<div className="overflow-clip z-1 relative rounded-b-[36px] border-b bg-background xl:pt-22 pt-14 [box-shadow:0_30px_60px_rgba(0,0,0,0.5),0_1px_0_var(--border)]">
				<Hero />
				<div className="xl:px-3 xl:mx-30">
					<MarketingHomeHero />
					<MarketingHomeShowcase />

					<div className="max-xl:px-8">
						<MarketingHomeUserSection />
						<MarketingHomeIntegrationSection />

						<MarketingHomeServerSection />

						<MarketingHomeMoreSection />
					</div>
				</div>
				<div className="relative mt-20">
					<FinalRemark />
					<span className="absolute bottom-0 z-10 grid text-xs gap-2 w-full py-5 bg-[linear-gradient(transparent,var(--mantle)_60%)] rounded-2xl px-4">
						<span>
							<sup>1</sup> {m["HomePage.sup_1"]()}
						</span>
					</span>
				</div>
			</div>
			<div className="overflow-hidden sticky bottom-0 z-0 pb-20">
				<footer className="w-full pb-0 flex flex-col md:flex-row md:items-center md:justify-between p-10">
					<div className="flex flex-col items-start justify-start gap-y-5 max-w-xs mx-0">
						<span className="flex items-center gap-2">
							<SolarPicture />
							PluralBuddy
						</span>
						<span className="tracking-tight text-muted-foreground text-left">
							{m["FooterComponent.lgbt_lives_matter"]()}
						</span>
					</div>
					<div className="pt-5 md:w-1/2">
						<div className="flex flex-col justify-start md:flex-row md:items-start md:justify-between gap-y-5 lg:pl-10">
							<div className="flex flex-col gap-y-2 list-none">
								<li className="inline-flex mb-2 text-sm font-semibold text-primary">
									{m["FooterComponent.heading_1"]()}
								</li>
								<FooterItem link="https://github.com/giftedl/PluralBuddy">
									GitHub
								</FooterItem>
								<FooterItem link="https://gftl.fyi/invite">
									{m["FooterComponent.invite"]()}
								</FooterItem>
								<FooterItem link="https://gftl.fyi/discord">
									{m["FooterComponent.join_support_server"]()}
								</FooterItem>
								<FooterItem link="https://gftl.fyi/docs">
									{m["FooterComponent.docs"]()}
								</FooterItem>
							</div>
							<div className="flex flex-col gap-y-2 list-none">
								<li className="inline-flex mb-2 text-sm font-semibold text-primary">
									{m["FooterComponent.docs"]()}
								</li>
								<FooterItem link="/docs/pluralbuddy/get-started">
									{m["FooterComponent.getting_started"]()}
								</FooterItem>
								<FooterItem link="/docs/pluralbuddy/">
									{m["FooterComponent.intro"]()}
								</FooterItem>
								<FooterItem link="/docs/pluralbuddy/get-started">
									{m["FooterComponent.ctx_menu_actions"]()}
								</FooterItem>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}

function FooterItem({
	children,
	link,
}: {
	children: JSX.Element | string;
	link: string;
}) {
	return (
		<li className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug text-muted-foreground">
			<a href={link}>{children}</a>
			<div className="flex size-4 items-center justify-center border border-border rounded translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
				<ChevronRight />
			</div>
		</li>
	);
}
