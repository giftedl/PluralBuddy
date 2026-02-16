"use client";

import { useEffect } from "react";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { usePathname } from "next/navigation";

export function DiscordLoginComponent() {
	const pathname = usePathname();

	authClient.signIn.social({
		provider: "discord",
		callbackURL: pathname,
	});

	return null;
}
