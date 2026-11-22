import { LoadingProfileState } from "#/components/auth/loading-profile";
import { SignedIn } from "#/components/auth/signed-in";
import { SignedOut } from "#/components/auth/signed-out";
import { Button } from "#/components/ui/button";
import { Discord } from "#/components/ui/discord";
import { Material } from "#/components/ui/material";
import { Placeholder } from "#/components/ui/placeholder";
import { SpinnerView } from "#/components/ui/spinner-view";
import { useAuth } from "#/hooks/use-auth";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Frown } from "lucide-react";

export const Route = createFileRoute("/_requiresAuth")({
  component: RouteComponent,
});

function RouteComponent() {
  const { login } = useAuth();

  return (
    <div className="relative w-full h-full">
      <LoadingProfileState>
        <SpinnerView />
      </LoadingProfileState>
      <SignedIn>
        <Outlet />
      </SignedIn>
      <SignedOut>
        <Material
          rounding="none"
          className="flex h-full min-h-[calc(100vh-57px)] w-full flex-col justify-center gap-2 border-t-0 text-center"
        >
          <Placeholder
            icon={<Frown />}
            title="Login Required"
            description="You must login to Discord to see your system."
          >
            <Button
              className="mt-2 flex items-center gap-2 bg-[#5865F2]! text-white!"
              onClick={() => login({ redirectUri: "/" })}
            >
              <Discord className="size-4 fill-white" />
              Login with Discord
            </Button>
          </Placeholder>
        </Material>
      </SignedOut>
    </div>
  );
}
