"use client";

import AuthorizedAppsPage from "@/components/app/pages/authorized-apps/page";
import ExpressAlterPage from "@/components/app/pages/express/page";
import ExpressSpecificAlterPage from "@/components/app/pages/express/page";
import NotFoundPage from "@/components/app/pages/not-found";
import { SettingsLayout } from "@/components/app/pages/settings-layout";
import { DiscordLoginComponent } from "@/components/discord-login";
import { ExpressList } from "@/components/pages/express-page.client";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { TRPCProvider } from "@/server/client";
import { trpc } from "@/server/client-trpc";
import {
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, { useEffect, useState } from "react";
import {
	Routes,
	Route,
	BrowserRouter,
	useLocation,
	Outlet,
} from "react-router";
import superjson from "superjson";

const queryClient = new QueryClient();

export default function PluralBuddyApp() {
	const { data: session, isPending } = authClient.useSession();
	const [trpcClient] = useState(() =>
		trpc.createClient({
			links: [
				httpBatchLink({
					url: "/api/trpc",
					transformer: superjson,
				}),
			],
		}),
	);

	if (isPending)
		return (
			<div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 block justify-center text-center gap-2">
				<span className="w-full flex justify-center">
					<Spinner />
				</span>

				<span className="text-sm pt-2">Loading app...</span>
			</div>
		);

	if (!isPending && session === null) {
		return <DiscordLoginComponent />;
	}

	return (
		<main className="router-boundrary">
			<QueryClientProvider client={queryClient}>
				<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
					<BrowserRouter>
						<Routes>
							<Route
								path="/app/settings"
								element={<SettingsLayout />}
							>
								<Route
									path="/app/settings/authorized-apps"
									element={<AuthorizedAppsPage />}
								/>
								<Route
									path="/app/settings/express/alter/:alter"
									element={<ExpressSpecificAlterPage />}
								/>
								<Route path="/app/settings/express" element={<ExpressList />} />
							</Route>
							<Route path="*" element={<NotFoundPage />} />
						</Routes>
					</BrowserRouter>
				</TRPCProvider>
			</QueryClientProvider>
		</main>
	);
}
