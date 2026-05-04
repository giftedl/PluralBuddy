import { SettingsSidebar } from "@/components/app/settings-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { SidebarHookRemote } from "../hook-remote";
import { SystemSidebar } from "../system-sidebar";
import { db } from "@/lib/app/dexie";
import { Button } from "@/components/ui/shadcn-button";
import pako from "pako";
import {
	ButtonGroup,
	ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { ChevronDown, LogIn } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTRPCClient } from "@/server/client";
import { useMutation } from "@tanstack/react-query";
import { PAlterObject, PSystemObject, PTagObject } from "plurography";
import z from "zod";
import { gatherPayload, useSyncMutation } from "@/lib/app/use-sync";
import { authClient } from "@/lib/auth-client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SystemLayout() {
	const route = useNavigate();
	const t = useTRPCClient()
	const syncMutation = useSyncMutation(t);
	const {data} = authClient.useSession();
	const {pathname} = useLocation();

	useEffect(() => {
		(async () => {
			const existingSystem = await db.systems.get("@me");

			if (existingSystem === undefined) route("/app/onboarding");
		})();
	});

	return (
		<SidebarProvider className="mt-13 h-[calc(100vh-52px)] min-h-0">
			<SystemSidebar />
			<SidebarInset>
				<div className="fixed border-b w-full p-2 bg-background rounded-t-xl">
					<ButtonGroup>
						{data?.session ? <Button
							variant="secondary"
							onClick={async () =>
								syncMutation.mutate({
									data: await gatherPayload(),
									prefer: "local",
								})
							}
						>
							Sync
						</Button> : <Tooltip><TooltipTrigger asChild><Button variant="secondary" onClick={() => authClient.signIn.social({provider: "discord", callbackURL: pathname})}><LogIn className="size-3.5"/> Sync</Button></TooltipTrigger><TooltipContent>
							Login to PluralBuddy to enable cloud syncing. Otherwise, you will not have access to some features, and your data will not be synced to the Discord bot. (however, you still have access to some local features)
							</TooltipContent></Tooltip>}
						<ButtonGroupSeparator />
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size="icon" variant="secondary">
									<ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuGroup>
									<DropdownMenuLabel>Via PluralBuddy</DropdownMenuLabel>
									<DropdownMenuItem
										className="font-bold"
										onClick={async () =>
											syncMutation.mutate({
												data: await gatherPayload(),
												prefer: "local",
											})
										}
									>
										Sync preferring local
									</DropdownMenuItem>
									<DropdownMenuItem 
										onClick={async () =>
											syncMutation.mutate({
												data: await gatherPayload(),
												prefer: "remote",
											})
										}>Sync preferring remote</DropdownMenuItem>
									<DropdownMenuItem>
										<span className="text-muted-foreground max-w-75 block text-wrap wrap-normal text-xs ">
											By default, all of PluralBuddy is stored locally. You can
											choose when to sync data between your browser and
											upstream.
										</span>
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuGroup>
									<DropdownMenuLabel>Via PluralKit</DropdownMenuLabel>
									<DropdownMenuItem>
										Sync preferring PluralBuddy
									</DropdownMenuItem>
									<DropdownMenuItem>Sync preferring PluralKit</DropdownMenuItem>
								</DropdownMenuGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</ButtonGroup>
				</div>
				<SidebarHookRemote />
				<main className="overflow-auto">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
