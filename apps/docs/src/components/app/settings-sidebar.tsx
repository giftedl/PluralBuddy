import { Link, useLocation, useRoutes } from "react-router";
import { Button } from "../ui/shadcn-button";
import { Separator } from "../ui/separator";
import { haptic } from "@/lib/haptic/haptic";
import {
	ChevronLeft,
	Clapperboard,
	House,
	Plug,
	Settings,
	ShieldCheck,
	TrainFront,
	Webhook,
} from "lucide-react";
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
} from "../ui/sidebar";
import { Mail } from "lucide-react";
import { motion } from "motion/react";

export function SettingsSidebar() {
	const location = useLocation();
	const newLayout = true;

	const pageSidebarProps = {
		initial: { opacity: 0, x: -40 },
		animate: { opacity: 0, x: -20 },
		whileInView: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -40 },
	};

	if (newLayout)
		return (
			<Sidebar className="h-full mt-[50px]" variant="inset">
				<SidebarHeader />
				<SidebarContent>
					<motion.div {...pageSidebarProps} transition={{ type: "tween" }}>
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											className="h-9"
											onClick={() => haptic()}
											isActive={
												location.pathname === "/app/system" ? true : undefined
											}
										>
											<Link to="/app/system" viewTransition>
												<ChevronLeft /> Back
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											className="h-9"
											onClick={() => haptic()}
											isActive={
												location.pathname === "/app/settings" ? true : undefined
											}
										>
											<Link to="/app/settings" viewTransition>
												<Settings /> Settings
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
										<SidebarMenuButton
											asChild
											className="h-9"
											onClick={() => haptic()}
											isActive={
												location.pathname === "/app/settings/authorized-apps"
													? true
													: undefined
											}
										>
											<Link to="/app/settings/authorized-apps" viewTransition>
												<ShieldCheck /> Authorized Applications
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											className="h-9"
											isActive={
												location.pathname.startsWith("/app/settings/express")
													? true
													: undefined
											}
										>
											<Link to="/app/settings/express" viewTransition>
												<TrainFront /> PluralBuddy Express
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											className="h-9"
											isActive={
												location.pathname.startsWith("/app/settings/webhooks")
													? true
													: undefined
											}
										>
											<Link to="/app/settings/webhooks" viewTransition>
												<Webhook /> Webhooks
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</motion.div>
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
