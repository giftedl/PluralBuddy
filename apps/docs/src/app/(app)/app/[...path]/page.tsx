"use client";

import AuthorizedAppsPage from "@/components/app/pages/authorized-apps/page";
import ExpressSpecificAlterPage from "@/components/app/pages/express/page";
import NotFoundPage from "@/components/app/pages/not-found";
import { SettingsLayout } from "@/components/app/pages/settings-layout";
import { DiscordLoginComponent } from "@/components/discord-login";
import { ExpressList } from "@/components/app/pages/express/express-page.client";
import { SettingsSidebar } from "@/components/app/settings-sidebar";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { TRPCProvider } from "@/server/client";
import { trpc } from "@/server/client-trpc";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React, {
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react";
import {
	Routes,
	Route,
	BrowserRouter,
	useLocation,
	Outlet,
} from "react-router";
import superjson from "superjson";
import ImportStagingPage from "@/components/app/pages/import-staging/page";
import ImportStagingDonePage from "@/components/app/pages/import-staging/done/page";
import { RemoteSidebarToggle } from "@/components/app/remote-sidebar-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSettings } from "@/components/app/app-settings";
import { IndexSettingsAppPage } from "@/components/app/pages/page";
import WebhooksAppPage from "@/components/app/pages/webhooks/page";
import OnboardingPage from "@/components/app/pages/onboarding/page";
import { SystemLayout } from "@/components/app/pages/system-layout";
import SystemIndexPage from "@/components/app/pages/systems/page";
import { LoginBoundary } from "@/components/app/pages/login-boundary";
import EditProfileSystemPage from "@/components/app/pages/systems/edit-profile/page";
import EditPrivacySystemPage from "@/components/app/pages/systems/edit-privacy/page";
import SystemPage from "@/components/app/pages/systems/system/page";
import { PrivacyGroupsSettingsAppPage } from "@/components/app/pages/systems/privacy-groups/page";
import { gatherPayload, useSyncMutation } from "@/lib/app/use-sync";

declare global {
	var trpcClient: ReturnType<typeof trpc.createClient>;
}

const queryClient = new QueryClient();

export default function PluralBuddyApp() {
	// const { data: session, isPending } = authClient.useSession();
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


	// const syncMutation = useSyncMutation(trpcClient);
	// const { isPending: isSyncPending } = useQuery({
	// 	queryKey: ["sync"],
	// 	queryFn: async () =>
	// 		await syncMutation.mutate({
	// 			data: await gatherPayload(),
	// 			prefer: "remote",
	// 		}),
	// });

	if (!globalThis.trpcClient) globalThis.trpcClient = trpcClient;

	// if (isPending || isSyncPending)
	// 	return (
	// 		<div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 block justify-center text-center gap-2">
	// 			<span className="w-full flex justify-center">
	// 				<Spinner />
	// 			</span>

	// 			<span className="grid">
	// 				<span className="text-sm pt-2">{isPending && "Logging in..."}</span>
	// 				<span className="text-sm pt-2">
	// 					{isSyncPending && "Syncing with remote..."}
	// 				</span>
	// 			</span>
	// 		</div>
	// 	);

	if ("virtualKeyboard" in navigator) {
		(navigator.virtualKeyboard as any).overlaysContent = false;
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
									<Route path="/app/onboarding" element={<OnboardingPage />} />
									<Route path="/app/system" element={<SystemLayout />}>
										<Route index element={<SystemIndexPage />} />
										<Route path="/app/system/system" element={<SystemPage />} />
										<Route
											path="/app/system/edit-profile"
											element={<EditProfileSystemPage />}
										/>
										<Route
											path="/app/system/edit-privacy"
											element={<EditPrivacySystemPage />}
										/>
										<Route
											path="/app/system/privacy-groups"
											element={<PrivacyGroupsSettingsAppPage />}
										/>
									</Route>
									<Route element={<LoginBoundary />}>
										<Route path="/app/settings" element={<SettingsLayout />}>
											<Route index element={<IndexSettingsAppPage />} />
											<Route
												path="/app/settings/authorized-apps"
												element={<AuthorizedAppsPage />}
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
										</Route>
										<Route
											path="/app/import-staging"
											element={<ImportStagingPage />}
										/>
										<Route
											path="/app/import-staging/done"
											element={<ImportStagingDonePage />}
										/>
									</Route>
									<Route path="*" element={<NotFoundPage />} />
								</Routes>
							</div>
						</BrowserRouter>
					</TRPCProvider>
				</QueryClientProvider>
			</main>
	);
}
