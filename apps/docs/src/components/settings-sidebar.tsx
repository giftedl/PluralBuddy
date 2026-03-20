import Link from "next/link";
import { Button } from "./ui/shadcn-button";

export function SettingsSidebar({ page }: { page: "apps" | "express" }) {
	return (
		<div className="flex gap-2">
			<Link href="/app/authorized-apps">
				<Button variant={page === "apps" ? "outline" : "ghost"}>
					Authorized Applications
				</Button>
			</Link>
			<Link href="/app/express">
				<Button variant={page === "express" ? "outline" : "ghost"}>
					Express
				</Button>
			</Link>
		</div>
	);
}
