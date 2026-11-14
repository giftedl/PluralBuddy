import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Frown } from "lucide-react";
import { Button } from "#/components/ui/button.tsx";
import { Discord } from "#/components/ui/discord";
import { Material } from "#/components/ui/material";
import { Placeholder } from "#/components/ui/placeholder";
import { useAuth } from "#/hooks/use-auth";
import { SignedOut } from "#/components/auth/signed-out";
import { LoadingProfileState } from "#/components/auth/loading-profile";
import { SpinnerView } from "#/components/ui/spinner-view";
import { SignedIn } from "#/components/auth/signed-in";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { login, profile } = useAuth();

  return (
    <main className="w-full relative h-screen">
      <LoadingProfileState>
        <SpinnerView />
      </LoadingProfileState>
      <SignedIn>
        <div className="px-4 pt-6">
          <h1 className="text-3xl tracking-tight font-semibold">Welcome back, {profile?.name}!</h1>
        </div>
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
    </main>
  );
}
