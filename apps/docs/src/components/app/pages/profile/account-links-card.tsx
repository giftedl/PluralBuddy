"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/shadcn-button";
import { useTRPCClient } from "@/server/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function AccountLinksCard() {
	const trpc = useTRPCClient();
	const queryClient = useQueryClient();
	const [targetAccountId, setTargetAccountId] = useState("");
	const { data: settings } = useQuery({
		queryKey: ["profile-data"],
		queryFn: async () => trpc.account.getAccountSettings.query(),
	});
	const { data: incomingRequests = [] } = useQuery({
		queryKey: ["account-link-requests"],
		queryFn: async () => trpc.account.getAccountLinkRequests.query(),
	});
	const { data: currentAccountId } = useQuery({
		queryKey: ["discord-account-id"],
		queryFn: async () => trpc.getDiscordId.query(),
	});
	const refreshLinks = async () => {
		await Promise.all([
			queryClient.invalidateQueries({ queryKey: ["profile-data"] }),
			queryClient.invalidateQueries({ queryKey: ["account-link-requests"] }),
		]);
	};
	const createRequest = useMutation({
		mutationFn: async () =>
			trpc.account.createAccountLinkRequest.mutate({ targetAccountId }),
		onSuccess: refreshLinks,
	});
	const respondToRequest = useMutation({
		mutationFn: async ({
			requestId,
			accept,
		}: {
			requestId: string;
			accept: boolean;
		}) =>
			trpc.account.respondToAccountLinkRequest.mutate({ requestId, accept }),
		onSuccess: refreshLinks,
	});
	const unlinkAccount = useMutation({
		mutationFn: async (accountId: string) =>
			trpc.account.unlinkAccount.mutate({ accountId }),
		onSuccess: refreshLinks,
	});

	const settingsWithSystem =
		settings && "linkedAccounts" in settings ? settings : null;
	const hasSystem = settingsWithSystem !== null;
	const linkedAccounts = settingsWithSystem?.linkedAccounts ?? [];
	const outgoingRequests = settingsWithSystem?.outgoingLinkRequests ?? [];
	const isOwner = settingsWithSystem?.isSystemOwner ?? false;
	const full = linkedAccounts.length >= 3;
	const error =
		createRequest.error ??
		respondToRequest.error ??
		unlinkAccount.error;

	return (
		<Card>
			<CardContent className="space-y-4">
				<CardTitle>Linked Discord accounts</CardTitle>
				<CardDescription>
					Link up to three Discord accounts to share system access. Each invited
					account must accept the request.
				</CardDescription>

				{hasSystem ? (
					<div className="space-y-2">
						{linkedAccounts.map((accountId) => {
							const isAccountOwner =
								accountId === settingsWithSystem?.systemOwnerId;
							const canUnlink =
								(isOwner && !isAccountOwner) ||
								(!isOwner && accountId === currentAccountId) ||
								(isOwner &&
									isAccountOwner &&
									linkedAccounts.length > 1);
							return (
								<div
									className="flex items-center justify-between gap-3 rounded-lg border p-3"
									key={accountId}
								>
									<div className="min-w-0">
										<p className="break-all font-medium">{accountId}</p>
										<p className="text-sm text-muted-foreground">
											{isAccountOwner ? "Owner" : "Linked account"}
											{accountId === currentAccountId ? " · You" : ""}
										</p>
									</div>
									{canUnlink && (
										<Button
											variant="destructive"
											disabled={unlinkAccount.isPending}
											onClick={() => unlinkAccount.mutate(accountId)}
										>
											Unlink
										</Button>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<p className="text-sm text-muted-foreground">
						You do not have a system yet. You can still accept an invitation
						below.
					</p>
				)}

				{hasSystem && (
					<>
						<div className="flex gap-2">
							<Input
								inputMode="numeric"
								placeholder="Discord account ID"
								value={targetAccountId}
								onChange={(event) => setTargetAccountId(event.target.value)}
								disabled={full || createRequest.isPending}
							/>
							<Button
								disabled={
									full ||
									createRequest.isPending ||
									!/^\d{17,20}$/.test(targetAccountId)
								}
								onClick={() => createRequest.mutate()}
							>
								Send invite
							</Button>
						</div>
						{outgoingRequests.map((request) => (
							<p
								className="text-sm text-muted-foreground"
								key={request.requestId}
							>
								Invite pending for {request.targetAccountId}
							</p>
						))}
					</>
				)}

				{incomingRequests.map((request) => (
					<div
						className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
						key={request.requestId}
					>
						<p className="text-sm">
							System account {request.systemId} invited you to link accounts.
						</p>
						<div className="flex gap-2">
							<Button
								disabled={respondToRequest.isPending}
								onClick={() =>
									respondToRequest.mutate({
										requestId: request.requestId,
										accept: true,
									})
								}
							>
								Accept
							</Button>
							<Button
								variant="outline"
								disabled={respondToRequest.isPending}
								onClick={() =>
									respondToRequest.mutate({
										requestId: request.requestId,
										accept: false,
									})
								}
							>
								Decline
							</Button>
						</div>
					</div>
				))}
				{error && (
					<p role="alert" className="text-sm text-destructive">
						{error.message}
					</p>
				)}
			</CardContent>
			<CardFooter>
				<span className="text-sm text-muted-foreground">
					Removing the owner transfers ownership to the first linked account.
				</span>
			</CardFooter>
		</Card>
	);
}
