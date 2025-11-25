import { Hero } from "./page.client";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { ExternalLink } from "lucide-react";

const buttonVariants = cva(
	"inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors",
	{
		variants: {
			variant: {
				primary:
					"bg-accent-foreground text-accent hover:bg-accent-foreground/90",
				secondary:
					"border bg-fd-secondary text-fd-secondary-foreground hover:bg-fd-accent",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	},
);

export default function HomePage() {
	return (
		<div className="xl:pt-8 justify-center text-center flex-1">
			<div className="relative flex h-[87vh] max-xl:h-screen xl:max-h-[850px] border xl:rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-origin-border">
				<Hero />
				<div className="flex flex-col z-2 px-4 size-full max-xl:!pt-32 md:p-12 max-md:items-center max-md:text-center text-left ">
					<h1 className="text-4xl my-8 leading-tighter font-medium xl:text-5xl xl:mb-12">
						The new age <br /> of{" "}
						<span className="text-accent-foreground">
							plurality data storage
						</span>
						.
					</h1>
					<p className="text-xl tracking-tight leading-snug font-light col-span-full md:text-2xl xl:text-3xl mb-8 xl:mb-12">
						PluralBuddy is the{" "}
						<span className="text-accent-foreground">
							next generation plurality bot
						</span>{" "}
						for Discord – built on <br className="max-md:hidden" /> principals of{" "}
						<span className="text-accent-foreground">speed</span>,{" "}
						<span className="text-accent-foreground">accessibility</span> &{" "}
						<span className="text-accent-foreground">data convenience.</span>
					</p>
					<div className="flex flex-row items-center justify-center gap-4 flex-wrap w-fit">
						<Link
							href="https://discord.com/oauth2/authorize?client_id=1436973163211657278"
							className={cn(buttonVariants(), "max-sm:text-sm items-center gap-2")}
						>
							<ExternalLink size={16} /> Add to Discord
						</Link>
						<Link
							href="/docs/pluralbuddy"
							className={cn(buttonVariants({ variant: "secondary" }), "max-sm:text-sm items-center gap-2")}
						>
							Documentation
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
