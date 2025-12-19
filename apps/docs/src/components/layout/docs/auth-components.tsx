/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

"use client";

import { buttonVariants } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Discord } from "@/components/ui/svgs/discord";
import { cn } from "@/lib/cn";

import { Code, LogIn, LogOut } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { SignedIn, SignedOut } from "@/components/auth/signed-in";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export function AuthComponents({ style }: { style: "main" | "docs" }) {
	const session = authClient.useSession();

	return (
		<>
			<SignedOut>
				<Popover>
					<PopoverTrigger asChild>
						<button
							aria-label="Sign In"
							className={cn(
								buttonVariants({ size: "icon-sm", color: "ghost" }),
								"cursor-pointer",
								style === "main" ? "border size-[36px]" : "",
							)}
							type="button"
						>
							<LogIn />
						</button>
					</PopoverTrigger>
					<PopoverContent>
						<button
							className="p-2 flex items-center gap-3 hover:bg-fd-accent rounded-lg cursor-pointer w-full"
							onClick={() =>
								authClient.signIn.social({
									provider: "discord",
								})
							}
							type="button"
						>
							<Discord className="size-[16px]" /> Sign In with Discord
						</button>
					</PopoverContent>
				</Popover>
			</SignedOut>
			<SignedIn>
				<Popover>
					<PopoverTrigger asChild>
						<button
							aria-label="User Profile"
							className={cn(
								buttonVariants({ size: "icon-sm", color: "ghost" }),
								"cursor-pointer",
								style === "main" ? "border size-[36px]" : "",
							)}
							type="button"
						>
							<Image
								src={session.data?.user.image ?? ""}
								width={style === "main" ? 24 : 18}
								height={style === "main" ? 24 : 18}
								alt="Your Profile Picture"
								unoptimized
								className="rounded-full"
							/>
						</button>
					</PopoverTrigger>
					<PopoverContent className="grid grid-cols-1 gap-2">
						<Link href="/developers/applications">
							<button
								className="p-2 flex items-center gap-3 hover:bg-fd-accent rounded-lg w-full cursor-pointer"
								type="button"
							>
								<Code size={16} /> OAuth Applications
							</button>
						</Link>
						<Separator />
						<button
							className="p-2 flex items-center gap-3 hover:bg-fd-accent rounded-lg w-full text-red-400 cursor-pointer"
							onClick={() => authClient.signOut()}
							type="button"
						>
							<LogOut size={16} /> Log out
						</button>
					</PopoverContent>
				</Popover>
			</SignedIn>
		</>
	);
}
