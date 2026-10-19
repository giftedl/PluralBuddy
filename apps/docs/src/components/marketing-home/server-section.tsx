import {
	DiscordContainer,
	DiscordMention,
	DiscordMessage,
	DiscordMessages,
	DiscordReaction,
	DiscordReactions,
	DiscordTextDisplay,
	DiscordThread,
	DiscordThreadMessage,
} from "@penwin/discord-components-react-render";
import { cn } from "cn";
import { ChevronDown, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { friendlyFeatureIndex } from "plurography";
import type React from "react";
import {
	AutoTopSectionNav,
	ForceRerender,
} from "@/app/(content)/(home)/page.client";
import { Callout } from "../callout";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Button } from "../ui/shadcn-button";
import { Switch } from "../ui/switch";

export function MarketingHomeServerSection() {
	return (
		<section className="w-full pt-50">
			<div
				className="flex items-center gap-4 bg-primary p-4 rounded-xl justify-between"
				id="02-a-server-customizable-experience"
			>
				<p className="lg:text-8xl max-lg:text-5xl font-mono text-transparent flex items-center gap-2 bg-clip-text bg-linear-to-b from-primary-foreground to-primary">
					02{" "}
					<a
						href="#02-a-server-customizable-experience"
						className="text-lg text-primary-foreground"
					>
						#
					</a>
				</p>
				<h1 className="text-primary-foreground font-[Mona_Sans] text-left lg:text-5xl max-lg:text-3xl font-semibold tracking-tighter">
					A server-customizable experience
				</h1>
			</div>

			<AutoTopSectionNav
				scrollPosition={2500}
				number={2}
				text="A server-customizable experience"
			/>
			<div
				className="my-15 lg:grid max-lg:flex flex-col grid-cols-3 w-full gap-4"
				id="bentogrid"
			>
				<Card className="pb-0! max-lg:mb-4">
					<CardContent className="text-left overflow-hidden">
						<h1 className="text-2xl text-primary font-bold">
							Disable or enable
						</h1>
						<h1 className="tracking-tighter text-2xl font-light">
							everything.
						</h1>

						<p className="text-muted-foreground mt-2">
							Disable or enable some commands which can be spammy, or abused.
							Feature flags dynamically change the features based on your
							server's guidelines or needs.
						</p>

						<div className="border rounded-lg bg-crust rounded-b-none border-b-none mt-18 relative">
							<div className="pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--mantle)_90%)] w-full h-[calc(100%+2px)] absolute z-20" />
							<div className="p-4 relative h-62.5 min-h-62.5">
								{Object.entries(friendlyFeatureIndex)
									.slice(1)
									.map((v) => (
										<div
											key={v[0]}
											className="p-2 rounded-lg text-xs cursor-pointer w-full flex items-center justify-between gap-3"
										>
											<div>
												<span>{v[1].title}</span>
												<span className="block text-muted-foreground">
													{v[1].description}
												</span>
											</div>

											<Switch defaultChecked />
										</div>
									))}
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="pb-0! max-lg:mb-4 max-lg:h-137.5">
					<CardContent className="text-left lg:min-h-100 h-full overflow-hidden relative">
						<h1 className="text-2xl text-primary font-bold">
							Make staff members
						</h1>
						<h1 className="tracking-tighter text-2xl font-light">
							stand out when proxying.
						</h1>

						<p className="text-muted-foreground mt-2">
							Make Discord containers appear on messages from your staff
							member's messages to show who has permissions to moderate on the
							server; even while proxying, sending images, or anything
							inbetween.
						</p>

						<div className="absolute bottom-0 z-0 left-0 px-4">
							<div className="border rounded-lg bg-crust rounded-b-none border-b-none relative">
								<div className="pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--mantle)_90%)] w-full h-[calc(100%+2px)] absolute z-20" />
								<div className="p-4 relative h-75 min-h-75">
									<div className="flex flex-wrap gap-1">
										{[
											"Owner",
											"Moderator",
											"Trial Mod",
											"Helper",
											"Manager",
											"Admin",
											"Representative",
											"VIP",
											"Verified",
											"Senior Mod",
											"Supporter",
											"Investor",
											"Staff",
											"Creator",
											"Donor",
											"Booster",
											"Site Moderator",
											"Artist",
											"Designer",
											"Developer",
											"Event Manager",
											"Partner",
											"Level 100",
											"Level 10",
											"Level 5",
										].map((v) => (
											<RoleExample key={v}>{v}</RoleExample>
										))}
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="pb-0! max-lg:mb-4 max-lg:h-125">
					<CardContent className="text-left min-h-100 overflow-hidden relative h-full">
						<h1 className="text-2xl text-primary font-bold">
							Extensive logging
						</h1>
						<h1 className="tracking-tighter text-2xl font-light">
							is the standard.
						</h1>

						<p className="text-muted-foreground mt-2">
							Know when every single person proxies an alter, and who they are.
							Logs are clear and concise.
						</p>

						<div className="absolute bottom-0 left-0 px-4">
							<div className="border rounded-lg bg-crust rounded-b-none border-b-none mt-23 relative">
								<div className="pointer-events-none bg-[linear-gradient(to_bottom,transparent,var(--mantle)_90%)] w-full h-[calc(100%+2px)] absolute z-20" />
								<div className="relative h-75 min-h-75">
									<div className="h-100 flex items-start gap-2">
										<div className="bg-destructive h-full w-1 rounded-l-lg" />
										<div className="p-4 pl-2 w-full flex flex-col gap-4">
											<div className="flex items-start gap-4 w-full justify-between">
												<div>i love life {"<3"} and love being kind</div>
												<Image
													src="/image/main-page/love-pfp.jpg"
													width={64}
													height={64}
													alt="Love is lovely!"
													className="rounded-lg"
												/>
											</div>
											<Separator className="w-full" />
											<div className="flex flex-col">
												<div className="text-muted-foreground text-xs">
													Sent by system/user{" "}
													<span className="font-mono bg-background p-0.2 rounded-sm border">
														1252031635692720224
													</span>
													, by alter{" "}
													<span className="font-mono bg-background p-0.2 rounded-sm border">
														1534737072412168200
													</span>
												</div>
												<div className="text-muted-foreground text-xs">
													Mention: @giftedly (
													<DiscordMention type="user">giftedly</DiscordMention>)
												</div>
												<div className="text-muted-foreground text-xs">
													Alter Mention: @love (💘 love)
												</div>
												<div className="text-muted-foreground text-xs">
													Proxied message as:{" "}
													<span className="font-mono bg-background p-0.2 rounded-sm border">
														1536287010447163392
													</span>{" "}
													→{" "}
													<span className="font-mono bg-background p-0.2 rounded-sm border">
														1536287015740645449
													</span>
												</div>
												<div className="text-muted-foreground text-xs">
													Sent at:{" "}
													<span className="bg-muted p-0.5 rounded-sm">
														August 10, 2026 at 3:16 AM
													</span>
												</div>
											</div>
											<Separator className="w-full" />
											<div className="flex flex-col">
												<div className="text-muted-foreground text-xs uppercase font-bold">
													Referenced Message
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			<Card className="p-0">
				<CardContent className="p-0 md:flex h-full">
					<div className="w-75 border-r min-h-200 max-md:hidden">
						<div className="p-2 flex items-center font-bold gap-1 border-b">
							<Button variant="ghost">
								<span>Big Plural HQ</span>
							</Button>
							<ChevronDown size={16} />
						</div>
						<div
							id="channel-scroller"
							className="overflow-auto h-full text-left p-2 "
						>
							{[
								"--‼️ the important stuff",
								"the-rules",
								"announcements",
								"events",
								"--💬 big plural investigations",
								"general",
								"conclusions",
								"complaints",
								"front-tracker-acquisitions",
								"proof",
								"--🎀 cutesy",
								"cats",
								"wallpapers",
								"anime",
								"vtubers",
								"--🔐 staff only!!",
								"pluralbuddy-logs",
								"server-logs",
								"the-evil",
							].map((v) =>
								v.startsWith("--") ? (
									<span
										key={v}
										className="text-muted-foreground flex items-center gap-1 pl-2 pt-5 pb-1"
									>
										{v.replace("--", "")} <ChevronDown size={16} />
									</span>
								) : (
									<Button
										className={cn(
											"flex items-center gap-2 w-full text-left justify-start",
											v === "announcements" && "bg-muted",
										)}
										variant="ghost"
										key={v}
									>
										<span className="text-muted-foreground">#</span>
										{v}
									</Button>
								),
							)}
						</div>
					</div>
					<section className="text-left relative md:h-200 w-full">
						<span className="w-full border-b h-12.25 p-2 block max-md:hidden">
							<Button
								variant="ghost"
								className={cn(
									"flex items-center gap-2 w-full text-left justify-start",
								)}
							>
								<span className="text-muted-foreground">#</span>announcements
							</Button>
						</span>
						<div className="md:absolute md:bottom-1 md:mt-auto pb-4 w-full ">
							<div className="md:overflow-auto md:max-h-162.5 max-md:h-full md:pt-30 max-md:pt-5 md:flex md:flex-col-reverse">
								<ForceRerender>
									<DiscordMessages className="bg-card not-dark:bg-mantle!">
										<DiscordMessage
											author="💘 love"
											className="w-full pl-4 hover:bg-background! pr-3 not-dark:text-foreground"
											avatar="/image/main-page/love-pfp.jpg"
											roleColor="#ff15dc"
										>
											hey guys, i'm the new owner of big plural. theres gonna be
											some big changes around here.
										</DiscordMessage>
										<DiscordMessage
											author="💘 love"
											className="w-full pl-4 hover:bg-background! mt-3 pr-3 not-dark:text-foreground"
											avatar="/image/main-page/love-pfp.jpg"
											roleColor="#ff15dc"
										>
											first off, we will now be using{" "}
											<DiscordMention
												type="user"
												className="not-dark:text-black"
											>
												PluralBuddy
											</DiscordMention>{" "}
											as our bot of choice. you can migrate with{" "}
											<DiscordMention
												type="command"
												className="not-dark:text-black"
											>
												/setup
											</DiscordMention>
											. <br />
											<DiscordReactions className="mt-1">
												<DiscordReaction emoji="🥰" count="4" />
												<DiscordReaction emoji="❤️" count="2" />
											</DiscordReactions>
											<DiscordThread
												cta="See 4 messages"
												name="PluralBuddy Migration"
												className="p-2 not-dark:bg-crust "
											>
												<DiscordThreadMessage className="not-dark:text-foreground!">
													what!! this is so cool
												</DiscordThreadMessage>
											</DiscordThread>
										</DiscordMessage>
										<DiscordMessage
											author="🎀 clementine"
											className="w-full pl-4 hover:bg-background! mt-3 pr-3 not-dark:text-foreground!"
											avatar="/image/main-page/giftedly-pfp.jpg"
											bot
										>
											i can see you all are struggling with system tags from the{" "}
											<Link
												className="border-b border-dashed border-primary hover:border-b-2"
												href="/docs/pluralbuddy/server-concepts#error-log"
											>
												server error log
											</Link>
											, make sure that you set a system tag when proxying in big
											plural!
											<DiscordReactions className="mt-1 ">
												<DiscordReaction emoji="❤️" count="17" />
												<DiscordReaction emoji="✅" count="12" />
											</DiscordReactions>
										</DiscordMessage>
										<DiscordMessage
											author="🎀 clementine"
											className="w-full pl-4 hover:bg-background! mt-3 pr-3 not-dark:text-foreground!"
											avatar="/image/main-page/giftedly-pfp.jpg"
											bot
										>
											<DiscordContainer accentColor="#ff15dc">
												<DiscordTextDisplay className="not-dark:text-foreground!">
													Owner
												</DiscordTextDisplay>
											</DiscordContainer>
											i also setup{" "}
											<Link
												className="border-b border-dashed border-primary hover:border-b-2"
												href="/docs/pluralbuddy/server-concepts#role-containers"
											>
												role containers
											</Link>{" "}
											for the staff in this server! if you are a staff member,
											you now get a fun little container.
											<DiscordReactions className="mt-1">
												<DiscordReaction emoji="🎀" count="3" />
											</DiscordReactions>
										</DiscordMessage>
										<DiscordMessage
											messageBodyOnly
											className="w-full pl-1 hover:bg-background! pr-3 not-dark:text-foreground!"
										>
											also, please stop trying to use pluralbuddy to get around
											our permission system, it doesn't work anyway.
											<Callout type="info" className="bg-crust">
												PluralBuddy will automatically check the roles of the
												user before allowing them to send attachments, etc.
											</Callout>
											<DiscordReactions className="mt-1 ">
												<DiscordReaction emoji="😡" count="11" />
												<DiscordReaction emoji="✅" count="18" />
											</DiscordReactions>
										</DiscordMessage>
									</DiscordMessages>

									<Separator className="mb-5" />
									<div className="pb-5 pl-4 flex flex-col gap-2 max-md:hidden">
										<div className="w-16 h-16 rounded-full bg-crust text-center flex justify-center font-bold text-4xl pt-3">
											#
										</div>
										<h1 className="font-bold text-3xl">
											Welcome to #announcements!
										</h1>
										<span>Find the secrets of Big Plural today!</span>
									</div>
								</ForceRerender>
							</div>
							<div className="bg-crust h-15 border p-4 max-md:hidden flex items-center gap-2 pt-4.5 text-[16px] rounded-lg m-4 mb-0 w-[calc(100%-40px)] cursor-not-allowed text-muted-foreground/60">
								<Plus /> Join this server to talk in Big Plural HQ!
							</div>
						</div>
					</section>
					<section className=" md:w-125 md:border-l text-left grid">
						<div className="p-4">
							<div className="flex items-center gap-3">
								<div className="w-6 h-6 pt-0.5 rounded-full bg-primary text-center text-primary-foreground">
									1
								</div>
								<div>
									<h1 className="text-2xl text-primary font-bold">Easy to</h1>
								</div>
							</div>
							<h1 className="tracking-tighter text-2xl font-light">
								migrate your members.
							</h1>

							<p className="text-muted-foreground mt-2">
								Everyone uses one command, puts in a system import, and they are
								done. No extra effort, no issues.
							</p>
						</div>
						<div className="p-4 border-t">
							<div className="flex gap-3 items-center">
								<div className="w-6 h-[6 pt-0.5 rounded-full bg-primary text-center text-primary-foreground">
									2
								</div>
								<div>
									<h1 className="text-2xl text-primary font-bold">See what</h1>
								</div>
							</div>
							<h1 className="tracking-tighter text-2xl font-light">
								goes wrong.
							</h1>

							<p className="text-muted-foreground mt-2">
								All server staff members get a server error log which you can
								see exactly what your members might be struggling with. Proxy
								errors, are left out of chat and only DM the person that
								encountered the error to avoid embarassment.
							</p>
						</div>
					</section>
				</CardContent>
			</Card>
		</section>
	);
}

function RoleExample({ children }: { children: React.ReactNode }) {
	return <div className="bg-background p-2 rounded-lg">{children}</div>;
}
