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
import pako from "pako";
import {
	ButtonGroup,
	ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { ChevronDown } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useTRPCClient} from "@/server/client";
import {useMutation} from "@tanstack/react-query";
import {PAlterObject, PSystemObject, PTagObject} from "plurography";
import z from "zod";

const importSyntax = z.object({
    system: PSystemObject.or(z.null()),
    alters: PAlterObject.array().max(2000),
    tags: PTagObject.array().max(2000)
})

export function SystemLayout() {
	const route = useNavigate();
    const t = useTRPCClient()
    const syncMutation = useMutation({
        mutationFn: async (data: {data: z.infer<typeof importSyntax>, prefer: "local" | "remote"}) => {

            const text = pako.deflate(JSON.stringify(data))

            const r = await t.system_apps.sync.mutate({
                data: text.toBase64(),
                prefer: "local"
            })

            const response = pako.inflate(Uint8Array.fromBase64(r.data));

            console.log(response);
        }
    })

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
						<Button variant="secondary" onClick={async () => {
                            const data = {
                                system: (await db.systems.get("@me")) ?? null,
                                alters: [],
                                tags: []
                            }

                            syncMutation.mutate({ data, prefer: "local" })
                        }}>Sync</Button>
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
