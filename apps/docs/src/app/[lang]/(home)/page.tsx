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
import { getTranslations } from "next-intl/server";
import reactStringReplace from "react-string-replace";

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

export default async function HomePage() {
	const t = await getTranslations("HomePage");
	const th = await getTranslations("HeaderComponent");

	return (
		<div className="xl:pt-8 justify-center text-center flex-1 xl:mx-30 xl:border-x pb-[300px]">
			<div className="xl:px-3">
				<div className="relative flex h-[87vh] max-xl:h-screen xl:max-h-[850px] *:text-center border xl:rounded-2xl overflow-hidden mx-auto w-full max-w-[1400px] bg-origin-border">
					<Hero />
					<div className="flex flex-col z-2 px-4 size-full max-xl:!pt-32 md:p-12 max-md:items-center max-md:text-center ">
						<h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium tracking-tighter text-balance text-center pb-5 fade-in animate-in">
							{t.rich("title", {
								headline: (chunks) => (
									<Highlighter
										iterations={5}
										action="circle"
										color="#841B50"
										padding={12}
										animationDuration={2000}
									>
										<span className="text-primary">{chunks}</span>
									</Highlighter>
								),
							})}
						</h1>
						<p className="text-base md:text-lg text-center text-muted-foreground font-medium text-balance leading-relaxed tracking-tight pb-3 fade-in animate-in">
							{t.rich("desc", {
								highlight: (chunks) => (
									<Highlighter
										action="underline"
										color="#841B50"
										iterations={5}
										animationDuration={2000}
									>
										<span className="text-accent-foreground">{chunks}</span>
									</Highlighter>
								),
								accent: (chunks) => (
									<span className="text-accent-foreground">{chunks}</span>
								),
								br: () => <br className="max-md:hidden" />,
							})}
						</p>
						<span className="flex items-center justify-center gap-3 *:flex *:items-center *:text-xs *:justify-center *:gap-2 lg:mb-9 max-lg:hidden fade-in animate-in">
							<span>
								<CloudLightningIcon className="text-primary" />
								{t("proxy_time_headline")}
								<sup>1</sup>
							</span>
							<span>
								<ShieldX className="text-primary" />
								{t("blacklist_headline")}
							</span>
							<span>
								<Ampersands className="text-primary" />
								{t("developer_headline")}
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
								<ExternalLink size={16} /> {t("add_discord_btn")}
							</Link>
							<Link
								href="/docs/pluralbuddy"
								className={cn(
									buttonVariants({ variant: "secondary" }),
									"max-sm:text-sm items-center gap-2",
								)}
							>
								{t("docs_btn")}
							</Link>
						</div>
					</div>
				</div>
				<span className="relative flex w-full border h-48 text-2xl bg-card max-w-fd-container xl:rounded-2xl xl:mt-2 items-center align-center justify-center gap-2 mx-auto">
					<div className="z-2">
						<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
							{t("oss_headline")}
						</h2>
						<div className="flex items-center gap-2 justify-center">
							{t.rich("oss_desc", {
								github: (chunks) => (
									<Link
										className="flex items-center gap-1 hover:underline text-primary underline-offset-4"
										href="https://github.com/giftedl/PluralBuddy"
									>
										<GithubDark className="size-6 *:fill-primary" /> {chunks}
									</Link>
								),
							})}
						</div>
						<div className="text-sm text-center justify-center mt-4 text-secondary-foreground max-w-[400px]">
							{t("oss_about")}
						</div>
					</div>
				</span>
			</div>

			<div className="py-16 border-t border-b mt-2">
				<h1 className="text-3xl md:text-4xl font-medium tracking-tighter text-primary text-center text-balance pb-1">
					{t.rich("optimized_headline", {
						highligher: (chunks) => (
							<DynamicHighligher>{chunks as string}</DynamicHighligher>
						),
					})}
				</h1>
				<p className="text-muted-foreground text-center text-balance font-medium">
					{t("optimized_desc")}
				</p>
			</div>

			<span className="grid lg:grid-cols-2 gap-2 my-3 xl:mx-3 *:max-lg:px-3 max-lg:mx-3 *:bg-card">
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-9">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						{t("instant_headline")}
					</h2>
					<div className="flex items-center gap-2 justify-center">
						{t("instant_title")}
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						{t("instant_desc")}
					</div>
				</span>
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-9">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						{t("identity_headline")}
					</h2>
					<div className="flex items-center gap-2 justify-center">
						{t("identity_title")}
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						{t.rich("identity_desc", {
							sup: (chunks) => <sup>{chunks}</sup>,
						})}
					</div>
				</span>
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-7">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						{t("quick_headline")}
					</h2>
					<div className="flex items-center gap-2 justify-center">
						{t("quick_title")}
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						{t.rich("quick_desc", {
							sup: (chunks) => <sup>{chunks}</sup>,
						})}
					</div>
				</span>
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-7 pb-7">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						{t("components_headline")}
					</h2>
					<div className="flex items-center gap-2 justify-center">
						{t("components_title")}
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						{t("components_desc")}
					</div>
				</span>
			</span>

			<div className="py-16 border-t border-b mt-2">
				<h1 className="text-3xl md:text-4xl font-medium tracking-tighter text-primary text-center text-balance pb-1">
					{t.rich("administrate_title", {
						highligher: (chunks) => (
							<DynamicHighligher>{chunks as string}</DynamicHighligher>
						),
					})}
				</h1>
				<p className="text-muted-foreground text-center text-balance font-medium">
					{t("administrate_desc")}
				</p>
			</div>

			<span className="grid lg:grid-cols-2 gap-2 my-3 xl:mx-3 *:max-lg:px-3 max-lg:mx-3 *:bg-card">
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-9">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						{t("change_bot_headline")}
					</h2>
					<div className="flex items-center gap-2 justify-center">
						{t("change_bot_title")}
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						{t("change_bot_desc")}
					</div>
				</span>
				<span className="justify-center text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-9">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						{t("alter_containers_headline")}
					</h2>
					<div className="flex items-center gap-2 justify-center">
						{t("alter_containers_title")}
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						{t("alter_containers_desc")}
					</div>
				</span>
				<span className="justify-center lg:col-span-2 text-center rounded-2xl border align-middle inline-block h-full pt-9 pb-7">
					<h2 className="sm:text-md uppercase text-sm text-primary font-mono">
						{t("permissions_headline")}
					</h2>
					<div className="flex items-center gap-2 justify-center">
						{t("permissions_title")}
					</div>
					<div className="text-sm text-center mx-auto justify-center mt-4 text-secondary-foreground max-w-[400px] w-full">
						{t("permissions_desc")}
					</div>
				</span>
			</span>
			<div className="w-full h-[700px] bg-primary text-left max-lg:px-3 lg:px-24 py-16 relative">
				<Ripple className="overflow-hidden" />
				<h1 className="text-2xl font-medium z-10">{t("get_started_title")}</h1>
				<div className="text-sm mt-4 text-secondary-foreground max-w-[400px] w-full">
					{t.rich("get_started_desc", {
						mono: (chunks) => <span className="font-mono">{chunks}</span>,
					})}
				</div>

				<Link
					href="https://discord.com/oauth2/authorize?client_id=1436973163211657278"
					className={cn(
						buttonVariants({ variant: "secondary" }),
						"max-sm:text-sm max-lg:w-[calc(100vw-24px)] items-center gap-2 w-1/3 mt-auto absolute bottom-[40px]",
					)}
				>
					<ExternalLink size={16} /> {t("add_discord_btn")}
				</Link>
			</div>

			<span className=" grid text-xs gap-2 mx-6 my-3 mt-25 py-10 bg-secondary rounded-2xl border px-4">
				<span>
					<sup>1</sup> {t("sup_1")}
				</span>
				<span>
					<sup>2</sup> {t("sup_2")}
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
							{th("lgbt_lives_matter")}
						</span>
					</div>
					<div className="pt-5 md:w-1/2">
						<div className="flex flex-col justify-start md:flex-row md:items-start md:justify-between gap-y-5 lg:pl-10">
							<div className="flex flex-col gap-y-2 list-none">
								<li className="inline-flex mb-2 text-sm font-semibold text-primary">
									{th("heading_1")}
								</li>
								<FooterItem link="https://github.com/giftedl/PluralBuddy">
									GitHub
								</FooterItem>
								<FooterItem link="https://gftl.fyi/invite">
									{th("invite")}
								</FooterItem>
								<FooterItem link="https://gftl.fyi/discord">
									{th("join_support_server")}
								</FooterItem>
								<FooterItem link="https://gftl.fyi/docs">
									{th("docs")}
								</FooterItem>
							</div>
							<div className="flex flex-col gap-y-2 list-none">
								<li className="inline-flex mb-2 text-sm font-semibold text-primary">
									{th("docs")}
								</li>
								<FooterItem link="/docs/pluralbuddy/get-started">
									{th("getting_started")}
								</FooterItem>
								<FooterItem link="/docs/pluralbuddy/">{th("intro")}</FooterItem>
								<FooterItem link="/docs/pluralbuddy/get-started">
									{th("ctx_menu_actions")}
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
