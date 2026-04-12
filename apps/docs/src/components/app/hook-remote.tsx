import { useEffect } from "react";
import { useSidebar } from "../ui/sidebar";

export function SidebarHookRemote() {
    const sidebar = useSidebar();

    useEffect(() => {
        window.addEventListener("pb/set-sidebar", () => {
            sidebar.toggleSidebar()
        })
    }, [sidebar]);

    return null;
}