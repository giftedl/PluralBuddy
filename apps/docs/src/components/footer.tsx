/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ChevronRight } from "lucide-react";
import { SolarPicture } from "./solar-picture";
import { FlickeringGrid } from "./ui/flickering-grid";
import { Separator } from "./ui/separator";
import { JSX } from "react";

export function Footer() {
	return (
		<footer>
			<Separator className="w-full" />
			<div className="absolute overflow-hidden">
				<div className="w-full pb-0 z-10 absolute flex flex-col md:flex-row md:items-center md:justify-between p-10">
					<div className="flex flex-col items-start justify-start gap-y-5 max-w-xs mx-0">
						<span className="flex items-center gap-2">
							<SolarPicture />
							PluralBuddy
						</span>
						<span className="tracking-tight text-muted-foreground text-left">
							🏳️‍⚧️🏳️‍🌈 LGBTQIA+ lives matter. PluralBuddy and its team support all
							individuals regardless of their identity.
						</span>
					</div>
					<div className="pt-5 md:w-1/2">
						<div className="flex flex-col justify-start md:flex-row md:items-start md:justify-between gap-y-5 lg:pl-10">
							<div className="flex flex-col gap-y-2 list-none">
								<li className="inline-flex mb-2 text-sm font-semibold text-primary">
									Links
								</li>
								<FooterItem link="https://github.com/giftedl/PluralBuddy">
									GitHub
								</FooterItem>
								<FooterItem link="https://gftl.fyi/invite">
									Invite Bot
								</FooterItem>
								<FooterItem link="https://gftl.fyi/discord">
									Join Support Server
								</FooterItem>
								<FooterItem link="https://gftl.fyi/docs">
									Documentation
								</FooterItem>
							</div>
							<div className="flex flex-col gap-y-2 list-none">
								<li className="inline-flex mb-2 text-sm font-semibold text-primary">
									Documentation
								</li>
								<FooterItem link="/docs/pluralbuddy/get-started">
									Getting Started
								</FooterItem>
								<FooterItem link="/docs/pluralbuddy/">Introduction</FooterItem>
								<FooterItem link="/docs/pluralbuddy/get-started">
									Context Menu Actions
								</FooterItem>
							</div>
						</div>
					</div>
				</div>
				<FlickeringGrid
					className="relative overflow-hidden max-w-screen max-lg:min-h-[500px] w-full z-0 lg:mask-[linear-gradient(to_right,white,transparent_40%)] max-lg:mask-[linear-gradient(to_bottom,white,transparent_40%)]"
					squareSize={4}
					gridGap={6}
					color="#F00077"
					maxOpacity={0.5}
					flickerChance={0.1}
					height={300}
					width={1080}
				/>
			</div>
		</footer>
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
