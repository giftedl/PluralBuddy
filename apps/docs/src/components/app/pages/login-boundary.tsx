import { DiscordLoginComponent } from "@/components/discord-login";
import { authClient } from "@/lib/auth-client";
import { Outlet } from "react-router";

export function LoginBoundary() {
	const { data: session, isPending } = authClient.useSession();

	if (!isPending && session === null) {
		return <DiscordLoginComponent />;
	}

	return <Outlet />;
}
