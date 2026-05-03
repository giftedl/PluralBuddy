import {Link, useLocation} from "react-router";
import {Button} from "../ui/shadcn-button";
import {haptic} from "@/lib/haptic/haptic";
import {
    Boxes,
    Clapperboard,
    EllipsisVertical, EyeOff, FolderDot,
    House,
    Plug,
    Settings, Shield,
    ShieldCheck, Tags,
    TrainFront, UserPen,
    Webhook,
} from "lucide-react";

import {Ellipse, LogOut, Bell, UserCircle} from "lucide-react";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
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
    SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem,
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
import {authClient} from "@/lib/auth-client";
import {motion} from "motion/react";

export const sidebarPages = [
    {
        pages: [
            {
                name: "Home",
                icon: House,
                path: "/app/system",
                sub: []
            }
        ]
    },
    {
        pages: [
            {
                name: "System",
                icon: FolderDot,
                path: "/app/system/system",
                sub: [
                    {
                        name: "Profile",
                        icon: UserPen,
                        path: "/app/system/edit-profile"
                    },
                    {
                        name: "Privacy",
                        icon: Shield,
                        path: "/app/system/edit-privacy"
                    }
                ]
            },
            {
                name: "Privacy Groups",
                icon: EyeOff,
                path: "/app/system/privacy-groups",
                sub: []
            },
            {
                name: "Alters",
                icon: Boxes,
                path: "/app/system/alters",
                sub: []
            },
            {
                name: "Tags",
                icon: Tags,
                path: "/app/system/tags",
                sub: []
            }
        ]
    }
]

export function SystemSidebar() {
    const location = useLocation();
    const user = authClient.useSession();
    const sidebar = useSidebar();

    const pageSidebarProps = {
        initial: {opacity: 0, x: -40},
        animate: {opacity: 0, x: -20},
        whileInView: {opacity: 1, x: 0},
        exit: {opacity: 0, x: -40},
    };

    return (
        <Sidebar collapsible="icon" className="h-full mt-[50px] pb-[50px]" variant="inset">
            <SidebarHeader/>
            <SidebarContent>
                <motion.span {...pageSidebarProps} transition={{type: "keyframes"}}>
                    {sidebarPages.map((page, index) => <SidebarGroup key={index}>
                        <SidebarGroupContent>
                            {page.pages.map(page =>
                                <SidebarMenu key={page.name}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            asChild
                                            onClick={() => haptic()}
                                            isActive={
                                                location.pathname === page.path ? true : undefined
                                            }
                                        >
                                            <Link to={page.path}>
                                                <page.icon/> {page.name}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    {page.sub.length > 0 && <SidebarMenuSub>
                                        {page.sub.map(subPage =>
                                            <SidebarMenuSubItem key={subPage.name}>
                                                <SidebarMenuSubButton
                                                    asChild
                                                    onClick={() => haptic()}
                                                    isActive={
                                                        location.pathname === subPage.path ? true : undefined
                                                    }
                                                >
                                                    <Link to={subPage.path}>
                                                        <subPage.icon/> {subPage.name}
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>)}</SidebarMenuSub>}
                                </SidebarMenu>)}
                        </SidebarGroupContent>
                    </SidebarGroup>)}
                </motion.span>
            </SidebarContent>
            {sidebar.open &&
                <SidebarFooter>
                    <motion.span {...pageSidebarProps} transition={{type: "tween"}}>
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
                                        <Settings/>
                                        Settings
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                        {user.data && <NavUser user={user.data.user}/>}
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
    const {isMobile} = useSidebar();
    const {signOut} = authClient;

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
                                <AvatarImage src={user.image ?? ""} alt={user.name}/>
                                <AvatarFallback className="rounded-lg">
                                    {user.name[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.name}</span>
                            </div>
                            <EllipsisVertical className="ml-auto size-4"/>
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
                                    <AvatarImage src={user.image ?? ""} alt={user.name}/>
                                    <AvatarFallback className="rounded-lg">
                                        {user.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.name}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            onClick={() => {
                                signOut();
                            }}
                        >
                            <LogOut/>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
