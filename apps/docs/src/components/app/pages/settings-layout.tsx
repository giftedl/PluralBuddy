import { SettingsSidebar } from "@/components/settings-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router";
import { SidebarHookRemote } from "../hook-remote";

export function SettingsLayout() {
	return (
		<SidebarProvider className="mt-[52px] h-[calc(100vh-52px)] min-h-0">

			<SettingsSidebar />
			<SidebarInset>
				<SidebarHookRemote />
				<main className="overflow-auto">
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
