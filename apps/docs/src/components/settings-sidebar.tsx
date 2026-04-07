import { Link, useLocation, useRoutes } from "react-router";
import { Button } from "./ui/shadcn-button";
import { Separator } from "./ui/separator";

export function SettingsSidebar() {
	const location = useLocation()

	return (
		<div className="block pt-18 px-2">
			<Link to={{ pathname: "/app/settings/authorized-apps" }} className="h-min">
				<Button variant={location.pathname.endsWith("authorized-apps") ? "outline" : "ghost"} className="w-full text-left">
					Authorized Applications
				</Button>
			</Link>
			<Link to={{ pathname: "/app/settings/express"}} className="h-min">
				<Button variant={!location.pathname.endsWith("authorized-apps") ? "outline" : "ghost"} className="w-full text-left mt-2" >
					Express
				</Button>
			</Link>
		</div>
	);
}
