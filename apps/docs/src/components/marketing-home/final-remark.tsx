import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { cn } from "cn";
import { Ampersands, Balloon, ChevronRight, CloudLightningIcon, DatabaseCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Hero } from "@/app/(content)/(home)/page.client";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import { buttonVariants } from "./hero";

export function FinalRemark() {
	return (
		<div className="relative flex z-0 pt-30 h-[60vh] text-left xl:max-h-212.5 xl:rounded-b-2xl overflow-hidden w-full bg-origin-border">
			<Hero />
			<div className="flex flex-col z-2 px-4 size-full max-xl:pt-32! md:p-12 ">
				<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center tracking-tighter text-balance pb-5 fade-in animate-in font-[Mona_Sans]">
					<span className="font-semibold text-primary">
						Start proxying, today.
					</span>
				</h1>
				<p className="text-base text-center md:text-lg text-muted-foreground font-medium text-balance leading-relaxed tracking-tight pb-3 fade-in animate-in">
					Create a new system with /setup, after adding the bot to a server, or sending it a DM. Free, forever.
				</p>
				<div className="flex justify-center w-full items-center gap-8 flex-wrap pt-4 fade-in animate-in">
					<Link
						href="https://discord.com/oauth2/authorize?client_id=1436973163211657278&integration_type=0&scope=bot&permissions=671099904"
						className={cn(
							buttonVariants(),
							"max-sm:text-sm items-center gap-2",
						)}
					>
						<ExternalLink size={16} /> {m["HomePage.add_discord_btn"]()}
					</Link>

					<Link
						href="/docs/pluralbuddy"
						className={cn(
							"max-sm:text-sm flex items-center gap-1 text-primary hover:gap-2 transition-all",
						)}
					>
						Learn More

						<ChevronRight size={16} />
					</Link>
				</div>
			</div>
		</div>
	);
}
