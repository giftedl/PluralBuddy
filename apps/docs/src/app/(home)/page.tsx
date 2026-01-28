import { DynamicHighligher, Hero } from "./page.client";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/cn";
import {
	Ampersands,
	ArrowRight,
	ChevronRight,
	CloudLightningIcon,
	ExternalLink,
	ShieldX,
} from "lucide-react";
import { Metadata, Viewport } from "next";
import { GithubDark } from "@/components/ui/svgs/githubDark";
import { GithubLight } from "@/components/ui/svgs/githubLight";
import { SolarPicture } from "@/components/solar-picture";
import { JSX } from "react";
import { FlickeringGrid } from "@/components/ui/flickering-grid";
import { Separator } from "@/components/ui/separator";
import { Highlighter } from "@/components/ui/highlighter";
import { Ripple } from "@/components/ui/ripple";
import { Dithering } from "@paper-design/shaders-react";

export const metadata: Metadata = {
	title: "PluralBuddy",
	description: "The new age of plurality data storage.",
	applicationName: "PluralBuddy",
};

export const viewport: Viewport = {
	themeColor: "#fccee8",
};

const buttonVariants = cva(
	"inline-flex justify-center px-5 py-3 rounded-full font-medium tracking-tight transition-colors",
	{
		variants: {
			variant: {
				primary: "bg-primary text-primary-foreground hover:bg-primary/90",
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
		<div className="xl:pt-8 justify-center text-center flex-1 xl:mx-30 xl:border-x pb-[300px]">
			<div className="xl:px-3">
				<div className="relative flex h-[87vh] max-xl:h-screen xl:max-h-[850px] *:text-center border xl:rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-origin-border">
					<Hero />
					<div className="flex flex-col z-2 px-4 size-full max-xl:!pt-32 md:p-12 max-md:items-center max-md:text-center ">
						<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center pb-5 fade-in animate-in">
							The{" "}
							<Highlighter
								iterations={5}
								action="circle"
								color="#841B50"
								padding={12}
								animationDuration={2000}
							>
								<span className="text-primary">faster</span>
							</Highlighter>{" "}
							age of plurality bots<span className="text-primary">.</span>
						</h1>
						<p className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight pb-3 fade-in animate-in">
							PluralBuddy is the{" "}
							<Highlighter
								action="underline"
								color="#841B50"
								iterations={5}
								animationDuration={2000}
							>
								<span className="text-accent-foreground">
									next generation plurality bot
								</span>
							</Highlighter>{" "}
							for Discord – built on <br className="max-md:hidden" /> principals
							of <span className="text-accent-foreground">speed</span>,{" "}
							<span className="text-accent-foreground">accessibility</span> &{" "}
							<span className="text-accent-foreground">data convenience.</span>
						</p>
						<span className="flex items-center justify-center gap-3 *:flex *:items-center *:text-xs *:justify-center *:gap-2 lg:mb-9 max-lg:hidden fade-in animate-in">
							<span>
								<CloudLightningIcon className="text-primary" />
								{"<"}600ms proxy time<sup>1</sup>
							</span>
							<span>
								<ShieldX className="text-primary" />
								Blacklists, manager roles, proxy delays
							</span>
							<span>
								<Ampersands className="text-primary" />
								Built with developers in mind
							</span>
						</span>
						<div className="flex w-full items-center justify-center gap-4 flex-wrap pt-4 fade-in animate-in">
							<Link
								href="https://discord.com/oauth2/authorize?client_id=1436973163211657278"
								className={cn(
									buttonVariants(),
									"max-sm:text-sm items-center gap-2",
								)}
							>
								<ExternalLink size={16} /> Add to Discord
							</Link>
							<Link
								href="/docs/pluralbuddy"
								className={cn(
									buttonVariants({ variant: "secondary" }),
									"max-sm:text-sm items-center gap-2",
								)}
							>
								Documentation
							</Link>
						</div>
					</div>
				</div>
				<span className="relative flex w-full border h-48 text-2xl bg-card max-w-fd-container xl:rounded-2xl xl:mt-2 items-center align-center justify-center gap-2 mx-auto">
					<div className="z-2">
						<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
							Open source
						</h2>
						<div className="flex items-center gap-2 justify-center">
							Find PluralBuddy on{" "}
							<Link
								className="flex items-center gap-1 hover:underline text-primary underline-offset-4"
								href="https://github.com/giftedl/PluralBuddy"
							>
								<GithubDark className="size-6 *:fill-primary" /> GitHub{" "}
							</Link>
						</div>
						<div className="text-sm text-center justify-center mt-4 text-secondary-foreground max-w-[400px]">
							PluralBuddy is open-source – and will stay that way. All code
							running on your server or system is overseen by other individuals.
						</div>
					</div>
				</span>
			</div>

			<div className="py-16 border-t border-b mt-2">
				<h1 className="text-3xl md:text-4xl font-medium tracking-tighter text-primary text-center text-balance pb-1">
					Optimized for <DynamicHighligher>systems</DynamicHighligher>
				</h1>
				<p className="text-muted-foreground text-center text-balance font-medium">
					At our forefront – PluralBuddy is built for systems and designed by
					systems.
				</p>
			</div>

			<span className="grid lg:grid-cols-2 gap-2 my-3 xl:mx-3 *:max-lg:px-3 max-lg:mx-3 *:bg-card">
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-9">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						Proxy now
					</h2>
					<div className="flex items-center gap-2 justify-center">
						Proxy whenever you are ready.
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						Auto-proxy settings allow you to proxy whenever you like – whether
						that's when you use a proxy tag, or whenever you send a message,
						PluralBuddy is ready when you are.
					</div>
				</span>
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-9">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						Alter passports
					</h2>
					<div className="flex items-center gap-2 justify-center">
						Solidify your identity.
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						Send a webhook or change your nickname – its up to you.<sup>2</sup>{" "}
						Changing your nickname can be formatted however you please.
					</div>
				</span>
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-7">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						Insanely quick
					</h2>
					<div className="flex items-center gap-2 justify-center">
						Ready, set, done!
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						Proxy quickly, as fast as 600ms<sup>1</sup> ! PluralBuddy was built
						from the ground up on being the bot that doesn't mess around with
						proxying.
					</div>
				</span>
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-7 pb-7">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						Batteries included
					</h2>
					<div className="flex items-center gap-2 justify-center">
						Commands not required.
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						With the power of Components v2, most features on PluralBuddy can be
						done using plain old buttons as opposed to commands. However, you
						can pick and choice which one you'd like to use!
					</div>
				</span>
			</span>

			<div className="py-16 border-t border-b mt-2">
				<h1 className="text-3xl md:text-4xl font-medium tracking-tighter text-primary text-center text-balance pb-1">
					<DynamicHighligher>Administrate</DynamicHighligher> with ease
				</h1>
				<p className="text-muted-foreground text-center text-balance font-medium">
					PluralBuddy has numerous administrator related features – designed to
					keep a balance between admin and user control.
				</p>
			</div>

			<span className="grid lg:grid-cols-2 gap-2 my-3 xl:mx-3 *:max-lg:px-3 max-lg:mx-3 *:bg-card">
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-9">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						Change the bot
					</h2>
					<div className="flex items-center gap-2 justify-center">
						Disable or enable different features of the bot
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						PluralBuddy is split into feature flags, dynamically changing the
						features allowed on PluralBuddy based on your server's guidelines or
						needs
					</div>
				</span>
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-9">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						Alter containers
					</h2>
					<div className="flex items-center gap-2 justify-center">
						Emphasize your staff members.
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						Add Discord containers to messages to show members that your staff
						members are chatting – even if they are currently proxying.
					</div>
				</span>
				<span className="justify-center col-span-2 text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-7">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						Finally correct permissions
					</h2>
					<div className="flex items-center gap-2 justify-center">
						Permissions work just how normal messages work.
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						PluralBuddy checks the permissions of users when they send a message
						to ensure they are sending messages and only using specific features
						when they are permitted by their roles.
					</div>
				</span>
			</span>
			<div className="w-full h-[700px] bg-primary text-left max-lg:px-3 lg:px-24 py-16 relative">
				<Ripple className="overflow-hidden" />
				<h1 className="text-2xl font-medium z-10">
					Get started with PluralBuddy today.
				</h1>
				<div className="text-sm mt-4 text-secondary-foreground max-w-[400px] w-full">
					PluralBuddy was built with love and pride as an alternative to the
					plurality bots you see everywhere. Migration from other bots like
					PluralKit or TupperBox can be done simply by using the{" "}
					<span className="font-mono">pb;setup</span> command when adding it to
					a server and selecting the Import option when going through the setup
					wizard.
				</div>

				<Link
					href="https://discord.com/oauth2/authorize?client_id=1436973163211657278"
					className={cn(
						buttonVariants({ variant: "secondary" }),
						"max-sm:text-sm max-lg:w-[calc(100vw-24px)] items-center gap-2 w-1/3 mt-auto absolute bottom-[40px]",
					)}
				>
					<ExternalLink size={16} /> Add to Discord
				</Link>
			</div>

			<span className=" grid text-xs gap-2 mx-6 my-3 mt-25 py-10 bg-secondary rounded-2xl border px-4">
				<span>
					<sup>1</sup> After PluralBuddy gains information about a message from
					the Discord Gateway, it usually takes under 600ms in optimal
					conditions to proxy a message.
				</span>
				<span>
					<sup>2</sup> Webhook proxy modes or nickname proxy modes can be
					enforced by a server administrator, made by decisions not inherently
					approved by PluralBuddy or its developers.
				</span>
			</span>

			<Separator className="w-full" />
			<div className="absolute overflow-hidden">
				<footer className="w-full pb-0 z-10 absolute flex flex-col md:flex-row md:items-center md:justify-between p-10">
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
				</footer>
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
