import { Link, useLocation, useRoutes } from "react-router";
import { Button } from "./ui/shadcn-button";
import { Separator } from "./ui/separator";
import { haptic } from "@/lib/haptic/haptic";
import {
  Activity,
  Ban,
  CircleUser,
  Clapperboard,
  Code,
  House,
  Info,
  Link2,
  Plug,
  RefreshCcw,
  ShieldCheck,
  TrainFront,
  Users,
  Webhook,
  Workflow,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Mail } from "lucide-react";
import { Marker, MarkerContent } from "./ui/marker";

export function SettingsSidebar() {
  const location = useLocation();
  const newLayout = true;

  if (newLayout)
    return (
      <Sidebar className="h-full mt-[50px]" variant="inset">
        <SidebarHeader />
        <SidebarContent>
          <h1 className="px-3 font-bold text-2xl">Settings</h1>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    onClick={() => haptic()}
                    isActive={location.pathname === "/app/settings" ? true : undefined}
                  >
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
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    onClick={() => haptic()}
                    isActive={location.pathname === "/app/settings/account" ? true : undefined}
                  >
                    <Link to="/app/settings/account">
                      <CircleUser /> Profile
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton
                    asChild
                    onClick={() => haptic()}
                    isActive={location.pathname === "/app/settings/social" ? true : undefined}
                  >
                    <Link to="/app/settings/social">
                      <Ban /> Social
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton
                    asChild
                    onClick={() => haptic()}
                    isActive={
                      location.pathname === "/app/settings/authorized-apps" ? true : undefined
                    }
                  >
                    <Link to="/app/settings/authorized-apps">
                      <ShieldCheck /> Authorized Apps
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Developers</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname.startsWith("/app/settings/webhooks") ? true : undefined
                    }
                  >
                    <Link to="/app/settings/webhooks">
                      <Webhook /> Webhooks
                    </Link>
                  </SidebarMenuButton>
                  <SidebarMenuButton
                    asChild
                    onClick={() => haptic()}
                    isActive={
                      location.pathname.startsWith("/app/settings/developers-v2") ? true : undefined
                    }
                  >
                    <Link to="/app/settings/developers-v2">
                      <Code /> OAuth Applications
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarGroupLabel>Product</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname.startsWith("/app/settings/express") ? true : undefined
                    }
                  >
                    <Link to="/app/settings/express">
                      <TrainFront /> PluralBuddy Express
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname.startsWith("/app/settings/about") ? true : undefined
                    }
                  >
                    <Link to="/app/settings/about">
                      <Info /> About PluralBuddy
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
            variant={location.pathname.endsWith("authorized-apps") ? "default" : "ghost"}
            className="block"
          >
            <Plug size={16} />
          </Button>
          <Button
            variant={location.pathname.endsWith("authorized-apps") ? "default" : "ghost"}
            className="w-full text-left block"
          >
            Applications
          </Button>
        </div>
      </Link>
      <Link to={{ pathname: "/app/settings/express" }} onClick={() => haptic()}>
        <div className=" flex items-center gap-0.5">
          <Button
            variant={!location.pathname.endsWith("authorized-apps") ? "default" : "ghost"}
            className="block"
          >
            <Clapperboard size={16} />
          </Button>
          <Button
            variant={!location.pathname.endsWith("authorized-apps") ? "default" : "ghost"}
            className="w-full text-left block"
          >
            Express
          </Button>
        </div>
      </Link>
    </div>
  );
}
