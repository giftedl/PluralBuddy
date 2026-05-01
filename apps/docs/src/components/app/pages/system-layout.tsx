import { SettingsSidebar } from "@/components/app/settings-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { SidebarHookRemote } from "../hook-remote";
import { SystemSidebar } from "../system-sidebar";
import { db } from "@/lib/app/dexie";

export function SystemLayout() {

    const route = useNavigate()

    useEffect(() => {
        (async () => {
            const existingSystem = await db.systems.get("@me");

            if (existingSystem === undefined) route("/app/onboarding")
        })();
    });

    return (
        <SidebarProvider className="mt-13 h-[calc(100vh-52px)] min-h-0">

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