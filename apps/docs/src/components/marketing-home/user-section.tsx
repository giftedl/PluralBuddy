import { cn } from "cn";
import { Check } from "lucide-react";
import {
	AutoTopSectionNav,
	BillingualLanguageBox,
	ProxyingBackgroundEffect,
	ProxyingMessages,
	ShiftingComponentsBox,
	ShiftingText,
	SpiralEffect,
} from "@/app/(content)/(home)/page.client";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function MarketingHomeUserSection() {
	return (
		<section className="w-full">
			<div
				className="flex items-center gap-4 bg-primary p-4 rounded-xl justify-between"
				id="01-a-human-friendly-discord-bot"
			>
				<p className="lg:text-8xl max-lg:text-5xl font-mono text-transparent flex items-center gap-2 bg-clip-text bg-linear-to-b from-primary-foreground to-primary">
					01{" "}
					<a
						href="#01-a-human-friendly-discord-bot"
						className="text-lg text-primary-foreground"
					>
						#
					</a>
				</p>
				<h1 className="text-primary-foreground font-[Mona_Sans] lg:text-5xl max-lg:text-3xl text-left font-semibold tracking-tighter">
					A human-friendly Discord bot
				</h1>
			</div>
			<AutoTopSectionNav
				scrollPosition={1100}
				number={1}
				text="A human-friendly Discord bot"
			/>
			<div
				className="my-15 lg:grid max-lg:flex flex-col grid-cols-3 w-full gap-4"
				id="bentogrid"
			>
				<Card className="pb-0! max-lg:mb-4">
					<CardContent className="text-left max-h-85 overflow-hidden">
						<h1 className="text-2xl text-primary font-bold">
							Start auto-proxying
						</h1>
						<h1 className="tracking-tighter text-2xl font-light">right now.</h1>

						<p className="text-muted-foreground mt-2">
							Use traditional auto-proxying commands like latching or
							alter-based proxying, or utilize the alter provided by your
							favorite PluralBuddy-integrated front tracker!
						</p>
						<div className="border p-4 rounded-lg mt-4 relative">
							<div className="pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--mantle)_70%)] w-full h-full absolute z-20" />
							<div className="relative">
								<div className="p-2 hover:bg-crust rounded-lg text-xs cursor-pointer w-full flex items-center justify-between">
									<div>
										<span>Latch Mode</span>
										<span className="block text-muted-foreground">
											Set this alter as the first alter in latch mode.
										</span>
									</div>

									<Check
										size={16}
										className="p-0.5 bg-primary text-primary-foreground rounded-full"
									/>
								</div>
								<div className="p-2 hover:bg-crust cursor-pointer text-xs">
									<span>Alter Mode</span>
									<span className="block text-muted-foreground">
										Only proxy this alter until auto-proxy is disabled.
									</span>
								</div>
								<div className="p-2 hover:bg-crust cursor-pointer text-xs">
									<span className="flex items-center gap-2 pb-1">
										<Skeleton className="h-[18px] w-[64px]" />
									</span>
									<span className="text-muted-foreground text-center">
										This will give that application control to choose which
										alters you will proxy.
									</span>
								</div>
								<div className="p-2 hover:bg-crust cursor-pointer text-xs">
									<span className="flex items-center gap-2 pb-1">
										<Skeleton className="h-[18px] w-[18px]" />
									</span>
									<span className="text-muted-foreground text-center">
										This will give that application control to choose which
										alters you will proxy.
									</span>
								</div>
								<div className="p-2 hover:bg-crust cursor-pointer text-xs">
									Disabled
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="pb-0!">
					<CardContent className="text-left max-h-85 overflow-hidden max-lg:max-h-140">
						<h1
							className="text-2xl text-primary font-bold"
						>
							Let everyone know
						</h1>
						<h1 className="tracking-tighter text-2xl font-light">
							who is proxying.
						</h1>

						<p className="text-muted-foreground mt-2">
							Use a webhook, a nickname on the host user, or both to convey who
							is proxying at a certain time.
						</p>

						<div className="border rounded-lg mt-4 max-w-full relative h-[300px] max-lg:h-[350px]">
							{/* <div className="overflow-hidden rounded-t-lg absolute max-w-full z-0">
								<ProxyingBackgroundEffect />
							</div> */}
							<div className="m-4 absolute z-10 rounded-lg h-full w-[calc(100%-30px)] backdrop-blur-xl bg-crust/60 p-4">
								<ProxyingMessages />
							</div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="text-left max-h-85 overflow-hidden">
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
								{"<"}0.6s
							</p>
						</div>

						<h1 className="text-2xl tracking-tighter text-primary font-bold text-center pt-8">
							Stop waiting.
						</h1>
						<p className="text-center">
							Proxying shouldn't take a year. It's done in under 600ms
							<sup>1</sup>.
						</p>
					</CardContent>
				</Card>
				<Card className="col-span-2 text-left">
					<CardContent className="text-left overflow-hidden h-full lg:flex items-center gap-16">
						<div>
							<h1 className="text-2xl text-primary font-bold">
								Every <ShiftingText />
							</h1>
							<h1 className="tracking-tighter text-2xl font-light">
								is exactly how you want to see it.
							</h1>
							<p className="text-muted-foreground mt-2 ">
								PluralBuddy allows for slash commands, prefix commands, and
								component-based interfaces (CUI's) for most functionality.
							</p>
						</div>
						<div className="max-lg:mt-4 max-lg:w-full max-lg:h-[250px] w-[1000px] h-full bg-crust rounded-lg">
							<ShiftingComponentsBox />
						</div>
					</CardContent>
				</Card>
				<Card className="pb-0! max-lg:mb-4">
					<CardContent className="text-left max-h-85 overflow-hidden">
						<h1 className="text-2xl text-primary font-bold">A bot made for</h1>
						<h1 className="tracking-tighter text-2xl font-light">
							many languages.
						</h1>

						<p className="text-muted-foreground mt-2 ">
							Crowd-sourced languages make every string in PluralBuddy
							billingual, and{" "}
							<a
								href="https://crowdin.com/project/pluralbuddy"
								className="text-primary underline"
							>
								you could help out too.
							</a>
						</p>

						<BillingualLanguageBox />
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
