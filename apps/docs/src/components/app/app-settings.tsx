"use client";

import { Cog } from "lucide-react";
import { Button } from "../ui/shadcn-button";
import { Link } from "react-router";

export function AppSettings() {
	return (
		<Link to="/app/settings">
			<Button size="icon" variant="outline">
				<Cog size={16} />
			</Button>
		</Link>
	);
}
