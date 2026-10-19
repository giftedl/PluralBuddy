import { ParaglideMessage } from "@inlang/paraglide-js-react";
import { cva } from "class-variance-authority";
import {
	Ampersands,
	Balloon,
	ChevronRight,
	CloudLightningIcon,
	DatabaseCheck,
	ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { m } from "@/paraglide/messages";
import { getLocale } from "@/paraglide/runtime";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export const buttonVariants = cva(
	"inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors",
	{
		variants: {
			variant: {
				primary: "bg-primary text-primary-foreground hover:bg-primary/90",
				secondary:
					"border bg-fd-secondary text-fd-secondary-foreground hover:bg-accent",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	},
);

export function MarketingHomeHero() {
	return (
		<div className="relative flex h-[60vh] text-left  xl:max-h-212.5 xl:rounded-2xl overflow-hidden w-full max-w-350 bg-origin-border">
			<div className="flex flex-col z-2 px-4 size-full max-xl:pt-32! md:p-12 ">
				<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tighter text-balance pb-5 fade-in animate-in font-[Mona_Sans]">
					<ParaglideMessage
						message={m["HomePage-v2.headline"]}
						markup={{
							plural: ({ children }) => (
								<HoverCard>
									<HoverCardTrigger asChild>
										<span className="hover:underline decoration-dashed decoration-primary cursor-help">
											{children}
										</span>
									</HoverCardTrigger>
									<HoverCardContent className="flex w-64 flex-col gap-0.5">
										<div className="font-semibold text-xs uppercase">
											plurality
										</div>
										<div>
											plurality (or multiplicity) is the existence of multiple
											self-aware entities inside one physical brain.
										</div>
										<a href="https://morethanone.info/" className="text-primary hover:underline text-sm">
											from morethanone.info
										</a>
									</HoverCardContent>
								</HoverCard>
							),
						}}
					/>{" "}
					<br />
					<span className="font-semibold text-primary">
						<ParaglideMessage message={m["HomePage-v2.headline_2"]} />
					</span>
				</h1>
				<p className="text-base md:text-lg text-muted-foreground font-medium text-balance leading-relaxed tracking-tight pb-3 fade-in animate-in">
					<ParaglideMessage message={m["HomePage-v2.desc"]} />
				</p>
				<span className="flex items-center gap-3 *:flex *:items-center *:text-xs *:justify-center *:gap-2 lg:mb-9 max-lg:hidden fade-in animate-in">
					<span>
						<CloudLightningIcon className="text-primary" />
						{m["HomePage.proxy_time_headline"]()}
						<sup>1</sup>
					</span>
					<span>
						<DatabaseCheck className="text-primary" />
						{m["HomePage-v2.blocks_headline"]({}, { locale: getLocale() })}
					</span>
					<span>
						<Ampersands className="text-primary" />
						{m["HomePage.developer_headline"]()}
					</span>
					<span>
						<Balloon className="text-primary" />
						{m["HomePage-v2.stickers_emojis_headline"]()}
					</span>
				</span>
				<div className="flex w-full items-center gap-8 flex-wrap pt-4 fade-in animate-in">
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
						{m["HomePage.docs_btn"]()}

						<ChevronRight size={16} />
					</Link>
				</div>
			</div>
		</div>
	);
}
