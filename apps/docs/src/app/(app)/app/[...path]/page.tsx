"use client";

import {
	QueryCache,
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
	BrowserRouter,
	Outlet,
	Route,
	Routes,
	useLocation,
} from "react-router";
import { toast } from "sonner";
import superjson from "superjson";
import { AppSettings } from "@/components/app/app-settings";
import { DynamicPageTitle, DynamicPageTitleRouterLess } from "@/components/app/dynamic-title";
import { AboutPage } from "@/components/app/pages/about/page";
import DeveloperApplications from "@/components/app/pages/applications/page";
import AuthorizedAppsPage from "@/components/app/pages/authorized-apps/page";
import { ExpressList } from "@/components/app/pages/express/express-page.client";
import ExpressAlterPage from "@/components/app/pages/express/page";
import ExpressSpecificAlterPage from "@/components/app/pages/express/page";
import ImportStagingDonePage from "@/components/app/pages/import-staging/done/page";
import ImportStagingPage from "@/components/app/pages/import-staging/page";
import ImportTranscriptsPage from "@/components/app/pages/import-transcripts/page";
import NotFoundPage from "@/components/app/pages/not-found";
import { IndexSettingsAppPage } from "@/components/app/pages/page";
import ProfilePage from "@/components/app/pages/profile/page";
import { SettingsLayout } from "@/components/app/pages/settings-layout";
import SocialPage from "@/components/app/pages/social/page";
import WebhooksAppPage from "@/components/app/pages/webhooks/page";
import { RemoteSidebarToggle } from "@/components/app/remote-sidebar-toggle";
import { DiscordLoginComponent } from "@/components/discord-login";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { TRPCProvider } from "@/server/client";
import { trpc } from "@/server/client-trpc";

declare global {
	var trpcClient: ReturnType<typeof trpc.createClient>
}

const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) =>
			toast.error(`Something went wrong: ${error.message}`),
	})
});

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

	if (!globalThis.trpcClient)
		globalThis.trpcClient = trpcClient;

	if (isPending)
		return (
			<div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 block justify-center text-center gap-2">
				<span className="w-full flex justify-center">
					<Spinner />
				</span>

				<DynamicPageTitleRouterLess title="|˶˙ᵕ˙ )ﾉﾞ Loading PluralBuddy" />
				<span className="text-sm pt-2">Loading app...</span>
			</div>
		);

	if (!isPending && session === null) {
		return <DiscordLoginComponent />;
	}

	if ("virtualKeyboard" in navigator) {
		(navigator.virtualKeyboard as any).overlaysContent = false;
	}

	if (window.location.pathname === "/") {
		window.location.pathname = "/app/settings"
	}

	return (
		<main className="router-boundrary overflow-hidden">
			<QueryClientProvider client={queryClient}>
				<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
					<BrowserRouter>
						<div className="p-2 h-14 w-full bg-sidebar flex justify-between items-center px-4 fixed z-50">
							<div className="flex flex-row items-center float-left flex-wrap gap-1">
								<RemoteSidebarToggle />
							</div>
							<div className="flex flex-row items-center float-right flex-wrap gap-1">
								<ThemeToggle />
								<AppSettings />
							</div>
						</div>
						<div className="h-screen w-screen overflow-hidden">
							<Routes>
								<Route path="/app/settings" element={<SettingsLayout />}>
									<Route
										index
										element={<IndexSettingsAppPage />}
									/>
									<Route
										path="/app/settings/account"
										element={<ProfilePage />}
									/>
									<Route
										path="/app/settings/authorized-apps"
										element={<AuthorizedAppsPage />}
									/>
									<Route
										path="/app/settings/social"
										element={<SocialPage />}
									/>
									<Route
										path="/app/settings/webhooks"
										element={<WebhooksAppPage />}
									/>
									<Route
										path="/app/settings/express/alter/:alter"
										element={<ExpressSpecificAlterPage />}
									/>
									<Route
										path="/app/settings/express"
										element={<ExpressList />}
									/>
									<Route
										path="/app/settings/developers-v2"
										element={<DeveloperApplications />}
									/>
									<Route
										path="/app/settings/about"
										element={<AboutPage />}
									/>
									<Route
										path="/app/settings/sync/transcript/:id"
										element={<ImportTranscriptsPage />}
									/>
								</Route>
								<Route
									path="/app/import-staging"
									element={<ImportStagingPage />}
								/>
								<Route
									path="/app/import-staging/done"
									element={<ImportStagingDonePage />}
								/>
								<Route path="*" element={<NotFoundPage />} />
							</Routes>
						</div>
					</BrowserRouter>
				</TRPCProvider>
			</QueryClientProvider>
		</main>
	);
}