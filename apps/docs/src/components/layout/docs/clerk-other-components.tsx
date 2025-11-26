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

import * as SignIn from "@clerk/elements/sign-in";
import * as Clerk from "@clerk/elements/common";

import {
	SignedIn,
	SignedOut,
	useClerk,
	UserButton,
	useUser,
} from "@clerk/nextjs";
import { LogIn, LogOut } from "lucide-react";
import Image from "next/image";

export function ClerkOtherComponents() {
	const clerk = useClerk();
	const user = useUser();

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
							)}
							type="button"
						>
							<LogIn />
						</button>
					</PopoverTrigger>
					<PopoverContent>
						<SignIn.Root routing="virtual">
							<Clerk.Connection name="discord" asChild>
								<div className="p-4 flex items-center gap-3 hover:bg-fd-accent rounded-lg cursor-pointer">
									<Discord className="size-[16px]" /> Sign In with Discord
								</div>
							</Clerk.Connection>
						</SignIn.Root>
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
							)}
							type="button"
						>
							<Image
								src={user.user?.imageUrl ?? ""}
								width={18}
								height={18}
								alt="Your Profile Picture"
								unoptimized
								className="rounded-full"
							/>
						</button>
					</PopoverTrigger>
					<PopoverContent>
						<div className="p-4 flex items-center gap-3 hover:bg-fd-accent rounded-lg">
							<Discord className="size-[16px]" /> Linked to{" "}
							{user.user?.username}
						</div>
						<Separator className="my-2" />
						<button
							className="p-4 flex items-center gap-3 hover:bg-fd-accent rounded-lg w-full text-red-400 cursor-pointer"
							onClick={() => clerk.signOut()}
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
