import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/shadcn-button";
import { Tab, TabList, TabPanel, Tabs } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { SimplexNoise } from "@paper-design/shaders-react";
import { AnimatePresence, motion } from "motion/react";
import { parseAsInteger, useQueryState } from "nuqs";
import { NewSystemForm } from "./new-system-form";
import { ArrowLeft } from "lucide-react";
import { haptic } from "@/lib/haptic/haptic";
import { useEffect } from "react";
import { db } from "@/lib/app/dexie";
import { redirect, useNavigate } from "react-router";

export default function OnboardingPage() {
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
	const { data: authData } = authClient.useSession();
	const route = useNavigate()

	useEffect(() => {
		(async () => {
			const existingSystem = await db.systems.get("@me");

			if (existingSystem !== undefined) route("/app/system")
		})();
	}, []);

	const pageAnimationProps = {
		initial: { opacity: 0, x: -40 },
		animate: { opacity: 0, x: -20 },
		whileInView: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -40 },
	};

	const bgAnimationProps = {
		initial: { opacity: 0, x: 40 },
		animate: { opacity: 0, x: 20 },
		whileInView: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: 40 },
	};

	return (
		<main className="pt-30 py-30 px-28 max-md:py-4 max-md:px-4 max-md:pt-30 md:flex justify-between gap-10 md:h-full max-md:max-h-full max-md:overflow-auto">
			<AnimatePresence mode="wait" initial={false}>
				{page === 0 && (
					<motion.div
						key="page0"
						className="relative md:min-w-125 md:h-full"
						{...pageAnimationProps}
					>
						<div className="md:absolute md:float-top top-0">
							<h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
								Welcome to PluralBuddy
							</h1>
							<p className="text-2xl text-gray-400">
								PluralBuddy is the platform designed to keep your plurality data
								easy to access and always accessible.{" "}
							</p>
						</div>
						<div className="md:absolute bottom-0 max-md:pt-5">
							<div className="sm:flex items-center gap-2">
								<Button
									className="min-w-50"
									onClick={() => setPage(1)}
									variant="outline"
								>
									Get Started
									<Kbd data-icon="inline-end" className="translate-x-0.5">
										⏎
									</Kbd>
								</Button>

								<Button className="flex max-sm:my-1" variant="ghost" disabled>
									<Avatar size="sm">
										<AvatarImage src={authData?.user.image ?? ""} />
										<AvatarFallback>
											{authData?.user.name[0].toLocaleUpperCase()}
										</AvatarFallback>
									</Avatar>
									Signed in as {authData?.user.name}
								</Button>
							</div>
							<span className="text-xs text-gray-400 inline-flex gap-1">
								Not you?{" "}
								<button
									className="underline cursor-pointer"
									type="button"
									onClick={() =>
										authClient.signIn.social({
											provider: "discord",
											callbackURL: "/app/onboarding",
										})
									}
								>
									Sign in again.
								</button>
							</span>
						</div>
					</motion.div>
				)}
				{page === 1 && (
					<motion.div
						className="relative md:min-w-125 md:h-full"
						key="page1"
						{...pageAnimationProps}
					>
						<div className="md:absolute md:float-top top-0 h-full">
							<h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
								Start fresh or import a new system
							</h1>
							<p className="text-2xl text-gray-400">
								It's your choice. You can import at any time, or clear all of
								your alters at any time.
							</p>
							<Card className="mt-14 min-h-full overflow-auto max-h-[300px]">
								<CardContent>
									<Tabs aria-label="Recipe App" defaultSelectedKey="f">
										<TabList>
											<Tab
												id="b"
												onClick={() => {
													setPage(0);
													haptic();
												}}
											>
												<ArrowLeft />
											</Tab>
											<Tab id="f" onClick={() => haptic()}>
												✨ New System
											</Tab>
											<Tab id="i" onClick={() => haptic()}>
												📥 Import
											</Tab>
											<Tab id="m" onClick={() => haptic()}>
												🗄️ File
											</Tab>
										</TabList>
										<TabPanel id="f">
											Create a new system from scratch. If you've never used any
											plurality product before or just want to start fresh, use
											this.
											<NewSystemForm finished={() => setPage(2)} />
										</TabPanel>
										<TabPanel id="i">
											Check the list of ingredients needed for your chosen
											recipes.
										</TabPanel>
										<TabPanel id="m">
											Discover curated meal plans to simplify your weekly
											cooking.
										</TabPanel>
									</Tabs>
								</CardContent>
							</Card>
						</div>
					</motion.div>
				)}
				{page === 2 && (
					<motion.div
						key="page1"
						className="relative md:min-w-125 md:h-full"
						{...pageAnimationProps}
					>
						<div className="md:absolute md:float-top top-0">
							<h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
								Done!
							</h1>
							<p className="text-2xl text-gray-400">
								PluralBuddy is setup! What will you do next?
							</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<motion.div className="md:relative max-md:pt-15" {...bgAnimationProps}>
				<SimplexNoise
					width={1000}
					height={720}
					colors={["#4449cf", "#ffd1e0", "#f94346"]}
					stepsPerColor={2}
					softness={0}
					speed={0.5}
					scale={0.6}
					className="rounded-2xl block max-md:max-h-75 max-md:max-w-full md:max-w-125"
				/>
			</motion.div>
		</main>
	);
}
