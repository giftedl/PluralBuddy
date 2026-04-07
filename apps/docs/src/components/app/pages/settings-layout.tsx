import { SettingsSidebar } from "@/components/settings-sidebar";
import React from "react";
import { Outlet } from "react-router";

export function SettingsLayout() {
	return (
		<div className="md:flex max-md:pr-3 pl-8">
			<SettingsSidebar />
			<Outlet />
		</div>
	);
}
