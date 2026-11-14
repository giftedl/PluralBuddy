import { ActionRow, Button, Container } from "@dressed/react";
import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { ChevronRight, ExternalLink } from "lucide-react";
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
import { Footer } from "@/components/footer";

// export const metadata: Metadata = {
// 	title: "PluralBuddy",
// 	description: "The new age of plurality data storage for Discord and beyond. Create alters & tags to spice up your system for those who are plural.",
// 	applicationName: "PluralBuddy",
// };

export const viewport: Viewport = {
  themeColor: "#fccee8",
};

export const metadata: Metadata = {
  title: "PluralBuddy – The plurality bot finally built correctly",
};

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
			<div className="overflow-clip z-1 relative rounded-b-[36px] border-b bg-background xl:pt-22 pt-14 [box-shadow:0_30px_60px_var(--background),0_1px_0_var(--background)]">
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
				<Footer />
			</div>
		</div>
	);
}

function FooterItem({ children, link }: { children: JSX.Element | string; link: string }) {
  return (
    <li className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug text-muted-foreground">
      <a href={link}>{children}</a>
      <div className="flex size-4 items-center justify-center border border-border rounded translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100">
        <ChevronRight />
      </div>
    </li>
  );
}
