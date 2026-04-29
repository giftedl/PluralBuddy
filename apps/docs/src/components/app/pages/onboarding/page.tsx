import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/shadcn-button";
import { authClient } from "@/lib/auth-client";
import { SimplexNoise } from "@paper-design/shaders-react";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { parseAsInteger, useQueryState } from "nuqs";

export default function OnboardingPage() {
	const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(0));
	const { data: authData } = authClient.useSession();

	return (
		<main className="pt-30 py-30 px-28 max-md:py-4 max-md:px-4 max-md:pt-30 md:flex justify-between gap-10">
			<AnimatePresence mode="wait" initial={false}>
				{page === 0 && (
					<motion.div
						key="page0"
						className="relative md:min-w-[500px]"
						initial={{ opacity: 0, x: -40 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -40 }}
						transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
					>
						<div className="md:absolute md:float-top top-[0px]">
							<h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
								Welcome to PluralBuddy
							</h1>
							<p className="text-2xl text-gray-400">
								PluralBuddy is the platform designed to keep your plurality data
								easy to access and always accessible.{" "}
							</p>
						</div>
						<div className="md:absolute bottom-[0px] max-md:pt-5">
							<div className="sm:flex items-center gap-2">
								<Button className="min-w-[200px]" onClick={() => setPage(1)} variant="outline">
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
						className="relative md:min-w-[500px]"
						key="page1"
						initial={{ opacity: 0, x: 40 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -40 }}
						transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}
					>
						<div className="md:absolute md:float-top top-[0px]">
							<h1 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
								Start fresh or import a new system
							</h1>
							<p className="text-2xl text-gray-400">
								It's your choice. You can import at any time, or clear all of
								your alters at any time.
							</p>
							<Card className="mt-14">
								<CardContent>hello</CardContent>
							</Card>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<div className="md:relative max-md:pt-15">
				<SimplexNoise
					width={500}
					height={720}
					colors={["#4449cf", "#ffd1e0", "#f94346"]}
					stepsPerColor={2}
					softness={0}
					speed={0.5}
					scale={0.6}
					className="rounded-2xl block max-md:max-h-[300px] max-md:max-w-[90vw]"
				/>
			</div>
		</main>
	);
}
