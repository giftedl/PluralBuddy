import { Link, useLocation, useRoutes } from "react-router";
import { Button } from "./ui/shadcn-button";
import { Separator } from "./ui/separator";
import { haptic } from "@/lib/haptic/haptic";
import { Clapperboard, House, Plug, ShieldCheck, TrainFront } from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import { Mail } from "lucide-react";

export function SettingsSidebar() {
	const location = useLocation();
	const newLayout = true;

	if (newLayout)
		return (
			<Sidebar className="h-full mt-[50px]" variant="inset">
				<SidebarHeader />
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild onClick={() => haptic()} isActive={location.pathname === ("/app/settings") ? true : undefined}>
										<Link to="/app/settings">
											<House /> Home
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton asChild onClick={() => haptic()} isActive={location.pathname === ("/app/settings/authorized-apps") ? true : undefined}>
										<Link to="/app/settings/authorized-apps">
											<ShieldCheck /> Authorized Applications
										</Link>
									</SidebarMenuButton>
									<SidebarMenuButton asChild isActive={location.pathname.startsWith("/app/settings/express") ? true : undefined}>
										<Link to="/app/settings/express">
											<TrainFront /> PluralBuddy Express
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				<SidebarFooter />
			</Sidebar>
		);

	return (
		<div className="block pt-18 px-2 w-[300px]">
			<Link
				to={{ pathname: "/app/settings/authorized-apps" }}
				className="h-min"
				onClick={() => haptic()}
			>
				<div className=" flex items-center gap-0.5 w-full">
					<Button
						variant={
							location.pathname.endsWith("authorized-apps")
								? "default"
								: "ghost"
						}
						className="block"
					>
						<Plug size={16} />
					</Button>
					<Button
						variant={
							location.pathname.endsWith("authorized-apps")
								? "default"
								: "ghost"
						}
						className="w-full text-left block"
					>
						Applications
					</Button>
				</div>
			</Link>
			<Link to={{ pathname: "/app/settings/express" }} onClick={() => haptic()}>
				<div className=" flex items-center gap-0.5">
					<Button
						variant={
							!location.pathname.endsWith("authorized-apps")
								? "default"
								: "ghost"
						}
						className="block"
					>
						<Clapperboard size={16} />
					</Button>
					<Button
						variant={
							!location.pathname.endsWith("authorized-apps")
								? "default"
								: "ghost"
						}
						className="w-full text-left block"
					>
						Express
					</Button>
				</div>
			</Link>
		</div>
	);
}
