/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Discord } from "@/components/ui/svgs/discord";
import { cn } from "@/lib/cn";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { Dithering } from "@paper-design/shaders-react";
import { useTheme } from "next-themes";

export default function SignInPage() {
	const { resolvedTheme } = useTheme();

	return (
		<div className="grid w-full flex-grow relative items-center justify-center px-4">
			<SignIn.Root>
				<Card className="w-full space-y-6 z-10 justify-center rounded-2xl p-8 sm:w-96">
					<SignIn.Step name="start">
						<header className="text-center">
							<h1 className="mt-4 text-xl font-medium tracking-tight">
								Sign in to PluralBuddy
							</h1>
							<span className="text-sm text-muted-foreground">
								Welcome back! Please select your Discord account.
							</span>
						</header>
						<Clerk.GlobalError className="block text-sm text-red-400" />

						<Clerk.Connection name="discord" asChild>
							<button
								className={cn(
									buttonVariants({ variant: "secondary" }),
									"w-full mt-12 gap-2",
								)}
								type="button"
							>
								<Discord className="size-[16px]" /> Continue with Discord
							</button>
						</Clerk.Connection>
					</SignIn.Step>
				</Card>
			</SignIn.Root>
			<Dithering
				className="w-screen h-screen absolute"
			    colorBack={resolvedTheme === "dark" ? "#000000" : "#ffffff"}
				colorFront="#fccee8"
				shape="warp"
				type="4x4"
				size={2}
				speed={1}
				scale={0.6}
			/>
		</div>
	);
}
