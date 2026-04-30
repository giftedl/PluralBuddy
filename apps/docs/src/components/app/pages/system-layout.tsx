import { SettingsSidebar } from "@/components/app/settings-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import React from "react";
import { Outlet } from "react-router";
import { SidebarHookRemote } from "../hook-remote";
import { SystemSidebar } from "../system-sidebar";

export function SystemLayout() {
    return (
        <SidebarProvider className="mt-[52px] h-[calc(100vh-52px)] min-h-0">

            <SystemSidebar />
            <SidebarInset>
                <SidebarHookRemote />
                <main className="overflow-auto">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}