"use client";

import { Cog, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Link } from "react-router";
import { authClient } from "@/lib/auth-client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/shadcn-button";

export function AppSettings() {
	const session = authClient.useSession();
	const router = useRouter();
	if (!session.isPending)
		return (
			<Popover>
				<PopoverTrigger asChild>
					<Link to="/app/settings">
						<Button size="icon" className="rounded-full" variant="outline">
							<Image
								src={session.data?.user.image ?? ""}
								width={18}
								height={18}
								alt="Your Profile Picture"
								unoptimized
								className="rounded-full"
							/>
						</Button>
					</Link>
				</PopoverTrigger>

				<PopoverContent className="grid grid-cols-1 gap-2">
					<button
						className="p-2 flex items-center gap-3 hover:bg-accent rounded-lg w-full text-red-400 cursor-pointer"
						onClick={() => {
							router.push("/"); // redirect to login page
							authClient.signOut({
								fetchOptions: {
									onSuccess: () => {},
								},
							});
						}}
						type="button"
					>
						<LogOut size={16} /> Log out
					</button>
				</PopoverContent>
			</Popover>
		);
}
