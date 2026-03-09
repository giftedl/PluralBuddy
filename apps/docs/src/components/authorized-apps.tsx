"use client";

import { authClient } from "@/lib/auth-client";
import { OAuthConsent, Scope } from "@better-auth/oauth-provider";
import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { Button } from "./ui/shadcn-button";
import { Ellipsis, X } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "./ui/dialog";
import {
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "./ui/drawer";
import { useState } from "react";
import Spinner from "./ui/spinner";
import { useRouter } from "next/navigation";

export function AuthorizedAppsCard({ app }: { app: OAuthConsent<Scope[]> }) {
	const { data, status } = useQuery({
		queryKey: [`app-${app.clientId}`],
		queryFn: async () =>
			await authClient.oauth2.publicClient({
				query: {
					client_id: app.clientId, // required
				},
			}),
	});
    const router = useRouter();
	const [deauthorizeOpen, setDeauthorizeOpen] = useQueryState(
		`deauthorize-${app.clientId}`,
		parseAsBoolean.withDefault(false),
	);
    const [loading, setLoading] = useState(false);

	if (status === "pending") {
		return <Card className="w-full font-mono p-4">{app.clientId}</Card>;
	}

	return (
		<>
			<Card className="w-full p-4">
				<div className="justify-between flex items-center">
					<div>
						<strong>{data?.data?.client_name}</strong> <br />
						<span className="text-xs font-mono">{app.scopes.join(" ")}</span>
					</div>
					<div>
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button variant="ghost">
									<Ellipsis />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									className="text-red-400"
									onClick={() => setDeauthorizeOpen(true)}
								>
									<X />
									Deauthorize
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</Card>
			<Dialog open={deauthorizeOpen} onOpenChange={setDeauthorizeOpen}>
				<DialogContent>
					<DialogHeader>
						<DrawerTitle>Deauthorize Application</DrawerTitle>
						<DrawerDescription>
							This will remove the ability for{" "}
							<strong>{data?.data?.client_name}</strong> to control your system
							until they reauthorize with PluralBuddy again.
						</DrawerDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose>
							<Button variant="outline" disabled={loading}>Cancel</Button>
						</DialogClose>
						<Button className="bg-red-500" disabled={loading} onClick={async () => {
                            setLoading(true);
                            await authClient.oauth2.deleteConsent({ id: app.id })
                            router.refresh()
                        }}>{loading && <Spinner />}Deauthorize</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
