import { SettingsSidebar } from "@/components/app/settings-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarHookRemote } from "../hook-remote";
import { SystemSidebar } from "../system-sidebar";
import { db } from "@/lib/app/dexie";
import { Button } from "@/components/ui/shadcn-button";
import {
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
} from "@/components/ui/button-group";
import { Check, ChevronDown } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Discord } from "@/components/ui/svgs/discord";

export function SystemLayout() {
	const route = useNavigate();
    const [loading, setLoading] = useState(false);


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
						<Button variant="secondary">Sync</Button>
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
									<DropdownMenuItem className="font-bold">Sync preferring local</DropdownMenuItem>
									<DropdownMenuItem>Sync preferring remote</DropdownMenuItem>
                                    <DropdownMenuItem><span className="text-muted-foreground max-w-75 block text-wrap wrap-normal text-xs ">By default, all of PluralBuddy is stored locally. You can choose when to sync data between your browser and upstream.</span></DropdownMenuItem>
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
