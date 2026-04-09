"use client";

import { PanelRightOpen } from "lucide-react";
import { Button } from "../ui/shadcn-button";

export function RemoteSidebarToggle() {
	return (
		<Button
			taptic
			variant="outline"
			size="icon"
			onClick={() => {
				window.dispatchEvent(new Event("pb/set-sidebar"));
			}}
		>
			<PanelRightOpen />
		</Button>
	);
}
