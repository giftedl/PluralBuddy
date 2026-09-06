import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router";
import { SettingsSidebar } from "@/components/settings-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarHookRemote } from "../hook-remote";

export function SettingsLayout() {
	return (
		<SidebarProvider className="mt-[52px] h-[calc(100vh-52px)] min-h-0">

			<SettingsSidebar />
			<SidebarInset>
				<SidebarHookRemote />
				<main className="overflow-auto" id='scrollable'>
					<Outlet />
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
