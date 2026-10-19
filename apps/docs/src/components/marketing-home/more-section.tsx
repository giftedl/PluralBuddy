import { cn } from "cn";
import { ArrowRight, ChevronRight, GlobeCode } from "lucide-react";
import Link from "next/link";
import {
	AutoTopSectionNav,
	ProxyingBackgroundEffect,
	ProxyingMessages,
	RandomIdsVisualization,
	SpiralEffect,
} from "@/app/(content)/(home)/page.client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../ui/accordion";
import { Card, CardContent } from "../ui/card";
import { highlight } from "./shared-shiki";
import { CodeBlock } from "./shiki";

export async function MarketingHomeMoreSection() {
	return (
		<section className="w-full pt-50">
			<div
				className="flex items-center gap-4 bg-primary p-4 rounded-xl justify-between"
				id="03-with-well-rounded-dynamics"
			>
				<p className="lg:text-8xl max-lg:text-5xl font-mono text-transparent flex items-center gap-2 bg-clip-text bg-linear-to-b from-primary-foreground to-primary">
					03{" "}
					<a
						href="#03-find-what-you-already-love"
						className="text-lg text-primary-foreground"
					>
						#
					</a>
				</p>
				<h1 className="text-primary-foreground font-[Mona_Sans] text-left lg:text-5xl max-lg:text-3xl font-semibold tracking-tighter">
					Find what you already love
				</h1>
			</div>

			<AutoTopSectionNav
				scrollPosition={4300}
				number={3}
				text="Find what you already love"
			/>
			<div
				className="my-15 lg:grid max-lg:flex flex-col grid-cols-3 w-full gap-4"
				id="bentogrid"
			>
				<Card className="pb-0! max-lg:mb-4">
					<CardContent className="text-left max-h-85 h-85 overflow-hidden">
						<h1 className="text-2xl text-primary font-bold">
							Always open-source
						</h1>
						<h1 className="tracking-tighter text-2xl font-light">
							and always free.
						</h1>

						<p className="text-muted-foreground mt-2">
							PluralBuddy is{" "}
							<Link
								href="https://gftl.fyi/github"
								className="text-primary underline"
								target="_blank"
							>
								open source
							</Link>{" "}
							under the extremely permissive MIT license, and will never have
							subscriptions or use a commerical model. Plurality for all!
						</p>

						<div className="relative h-50 w-full">
							<div className="absolute z-0 min-h-full justify-center flex items-center w-full">
								<SpiralEffect />
							</div>
							<div className="absolute z-5 min-h-full justify-center flex items-center w-full">
								<div className="bg-[radial-gradient(transparent,var(--mantle)_66%)] w-[200px] h-[200px]" />
							</div>
							<p
								className={cn(
									"text-8xl max-lg:text-7xl w-full absolute z-10 text-center font-black bg-clip-text tracking-normal py-12",
									"text-transparent bg-linear-to-b from-card-foreground not-dark:from-secondary to-primary not-dark:brightness-85 brightness-70 hover:brightness-100 transition-all",
								)}
							>
								$0
							</p>
						</div>
					</CardContent>
				</Card>
				<Card className="pb-0! max-lg:mb-4">
					<CardContent className="text-left max-h-85 h-85 overflow-hidden">
						<h1 className="text-2xl text-primary font-bold">Your data is</h1>
						<h1 className="tracking-tighter text-2xl font-light">
							always only yours.
						</h1>
						<p className="text-muted-foreground mt-2">
							PluralBuddy data is private-first, unless you do not want it to be
							that way. Alters are not assigned letter codes, rather you can
							pick a unique username for use for every alter in a system.
						</p>

						<div className="border rounded-lg mt-4 max-w-full relative h-[300px] max-lg:h-[350px]">
							{/* <div className="overflow-hidden rounded-t-lg absolute max-w-full z-0">
								<ProxyingBackgroundEffect />
							</div> */}
							<div className="m-4 absolute z-10 rounded-lg h-full w-[calc(100%-30px)] backdrop-blur-xl bg-crust/60 p-4">
								<RandomIdsVisualization />
							</div>
						</div>
					</CardContent>
				</Card>

				<Card className="pb-0! max-lg:mb-4">
					<CardContent className="text-left max-h-85 h-85 overflow-hidden">
						<h1 className="text-2xl text-primary font-bold">An API easy</h1>
						<h1 className="tracking-tighter text-2xl font-light">
							for everyone to use.{" "}
						</h1>

						<p className="text-muted-foreground mt-2">
							Discord bot data isn't just for Discord. Extensive APIs for
							PluralBuddy and their documentation are right here, even with an{" "}
							<a
								href="/openapi.yml"
								target="_blank"
								rel="noreferrer"
								className="text-primary underline"
							>
								OpenAPI spec
							</a>
							!
						</p>
						<div className="border rounded-lg relative mt-4 max-w-full bg-crust h-full max-lg:h-[350px] text-xs">
							<div className="pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--mantle)_50%)] w-full h-full absolute z-20 *:bg-crust! absolute pt-4 *:rounded-t-lg max-w-full overflow-x-auto h-full" />
							<CodeBlock
								initial={
									await highlight(
										`import { PAlter } from "plurography";
const api = "https://pluralbuddy.app/api"

await fetch(
	\`\${api}/v1/users/@me/system/create-alter\`,
	{
		headers: {
			Authorization: "Bearer xxx",
		}
	}
)`,
										"ts",
										"catppuccin-latte",
									)
								}
								className="*:bg-crust! absolute pt-4 *:rounded-t-lg max-w-full overflow-x-auto h-full"
							>{`import { PAlter } from "plurography";
const api = "https://pluralbuddy.app/api"

await fetch(
	\`\${api}/v1/users/@me/system/create-alter\`,
	{
		headers: {
			Authorization: "Bearer xxx",
		}
	}
)`}</CodeBlock>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex items-start max-md:flex-col max-md:gap-5 md:justify-between pt-40">
				<div className="text-left">
					<h1 className="text-2xl text-primary font-bold">FAQ</h1>
					<p className="text-muted-foreground mt-2">
						The questions asked about PluralBuddy the most.
					</p>
				</div>
				<Accordion type="multiple">
					<AccordionItem value="what-is-pluralbuddy" id="what-is-pluralbuddy">
						<AccordionTrigger>What is PluralBuddy?</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							PluralBuddy is a free & open source (FOSS) plurality bot, an
							accessibility tool for Discord allowing systems to create and
							proxy as alters.
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value="can-i-migrate-my-data"
						id="can-i-migrate-my-data"
					>
						<AccordionTrigger className="flex gap-1">
							Can PluralBuddy migrate data from another proxy bot? (ie.
							PluralKit)
						</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							<p className="mb-2!">
								Yes! Choose your proxy bot of choice when using /setup to import
								data.
							</p>
							<p>
								For PluralKit specifically, you can automatically sync data back
								and forth too!
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value="what-makes-it-different"
						id="what-makes-it-different"
					>
						<AccordionTrigger>What makes PluralBuddy special?</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							<p className="mb-2!">
								PluralBuddy has features that are built for the greater good of
								the plurality experience and moderation of servers. For example,
								most interfaces on PluralBuddy have versions of them that can be
								seen by simply clicking into components, without ever having to
								guess a command again.
							</p>
							<p>
								Additionally, due to PluralBuddy's size, we can ship features
								faster to make it a plurality bot that has tons of features
								without extensive wait.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="is-pluralbuddy-e2ee" id="is-pluralbuddy-e2ee">
						<AccordionTrigger>
							<span className="inline">
								Is PluralBuddy{" "}
								<a
									href="https://en.wikipedia.org/wiki/End-to-end_encryption"
									className="text-primary"
								>
									end to end encrypted
								</a>
								?
							</span>
						</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							<p className="mb-2!">
								No. Some sensitive data like tokens are encrypted, however, due
								to the fact that data on your device cannot be stored from a
								Discord bot, it's practically impossible to have end to end
								encryption. This is because the private key would have to be
								stored by the developers, which would render the encryption
								useless.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem
						value="is-pluralbuddy-a-front-tracker"
						id="is-pluralbuddy-a-front-tracker"
					>
						<AccordionTrigger className="flex gap-1">
							Can PluralBuddy store fronts / be a front tracker?
						</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							<p className="mb-2!">
								No. It is not a front tracker, and will never store fronts. You
								shouldn't use a Discord bot to store extensive data which is
								tied to an account that is bannable by Discord.
							</p>
							<p>
								If you want automatic proxying of fronting alters, use a
								PluralBuddy AI/AP compatible front tracker.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="status" id="status">
						<AccordionTrigger className="flex gap-1">
							Where does PluralBuddy show its status?
						</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							<p className="mb-2!">
								PluralBuddy's status can be seen{" "}
								<a
									href="https://status.giftedly.dev"
									target="_blank"
									rel="noreferrer"
								>
									here
								</a>
								!
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="data" id="data">
						<AccordionTrigger className="flex gap-1">
							Who can see the data put on a system?
						</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							<p className="mb-2!">
								PluralBuddy's data in a system is automatically private-first.
								You can optionally make certain alters/system public.
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="ai" id="ai">
						<AccordionTrigger className="flex gap-1">
							Does PluralBuddy use artificial intelligence to develop?
						</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							<p className="mb-2!">
								No. PluralBuddy is not assisted, developed, or built with
								artificial intelligence in any portion.
							</p>
							<p className="mb-2!">
								However, we cannot guarantee that the packages that we use
								aren't made with artificial intelligence, due to how most major,
								modern TypeScript packages are influenced by or developed
								partially by AI.
							</p>
							<p className="flex items-center gap-1">
								<GlobeCode size={16} />{" "}
								<span className="inline">
									See our AI policy for external contributions{" "}
									<a
										href="https://github.com/giftedl/PluralBuddy/blob/main/AGENTS.md"
										target="_blank"
										rel="noreferrer"
									>
										here
									</a>
									.
								</span>
							</p>
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="usage" id="usage">
						<AccordionTrigger className="flex gap-1">
							Who can use this bot?
						</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							Anyone!
						</AccordionContent>
					</AccordionItem>
					<AccordionItem value="app" id="app">
						<AccordionTrigger className="flex gap-1">
							Will PluralBuddy have an iOS/Android/Web dashboard?
						</AccordionTrigger>
						<AccordionContent className="h-full text-left">
							That is not currently planned. If you wish to modify a ton of
							alters, use your preferred front tracker, and sync it to
							PluralBuddy.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
			</div>
			<div className=" mt-15 text-center">
				<Link
					href="/docs/pluralbuddy"
					className="text-primary flex items-center gap-1 mx-auto justify-center text-sm"
				>
					Missing something?
					<ChevronRight size={16} />
				</Link>
			</div>
		</section>
	);
}
