import { Link, useLocation } from "react-router";
import { Button } from "../ui/shadcn-button";
import { haptic } from "@/lib/haptic/haptic";
import {
	Clapperboard,
	EllipsisVertical,
	House,
	Plug,
	Settings,
	ShieldCheck,
	TrainFront,
	Webhook,
} from "lucide-react";

import { Ellipse, LogOut, Bell, UserCircle } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
} from "../ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { motion } from "motion/react";

const sidebarPages = [{
	pages: [
		{
			name: "Home",
			icon: <House />,
			path: "/app/system"
		}
	]
}]

export function SystemSidebar() {
	const location = useLocation();
	const user = authClient.useSession();
	const sidebar = useSidebar();

	const pageSidebarProps = {
		initial: { opacity: 0, x: -40 },
		animate: { opacity: 0, x: -20 },
		whileInView: { opacity: 1, x: 0 },
		exit: { opacity: 0, x: -40 },
	};

	return (
		<Sidebar collapsible="icon" className="h-full mt-[50px] pb-[50px]" variant="inset" >
			<SidebarHeader />
			<SidebarContent>
				<motion.span {...pageSidebarProps} transition={{ type: "keyframes" }}>
					{sidebarPages.map((page, index) => <SidebarGroup>
						<SidebarGroupContent>
							{page.pages.map(page =>
								<SidebarMenu>
									<SidebarMenuItem>
										<SidebarMenuButton
											asChild
											onClick={() => haptic()}
											isActive={
												location.pathname === page.path ? true : undefined
											}
										>
											<Link to="/app/system">
												{page.icon} {page.name}
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								</SidebarMenu>)}
						</SidebarGroupContent>
					</SidebarGroup>)}
				</motion.span>
			</SidebarContent>
			{sidebar.open &&
				<SidebarFooter>
					<motion.span {...pageSidebarProps} transition={{ type: "tween" }}>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									onClick={() => haptic()}
									isActive={
										location.pathname === "/app/settings" ? true : undefined
									}
								>
									<Link to="/app/settings">
										<Settings />
										Settings
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
						{user.data && <NavUser user={user.data.user} />}
					</motion.span>
				</SidebarFooter>}
		</Sidebar>
	);
}

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		image?: string | null | undefined;
	};
}) {
	const { isMobile } = useSidebar();
	const { signOut } = authClient;

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={user.image ?? ""} alt={user.name} />
								<AvatarFallback className="rounded-lg">
									{user.name[0]}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
							</div>
							<EllipsisVertical className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.image ?? ""} alt={user.name} />
									<AvatarFallback className="rounded-lg">
										{user.name[0]}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => {
								signOut();
							}}
						>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
