import { ImportDataForm } from "@/components/app/import-data-form";
import { AuthorizedAppsCard } from "@/components/authorized-apps";
import { DiscordLoginComponent } from "@/components/discord-login";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { getImportDataById } from "@/lib/get-import";
import { AppWindow, ArrowUpRightIcon, CloudDownload } from "lucide-react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Authorized Apps - PluralBuddy App",
	description: "View authorized applications on PluralBuddy.",
	applicationName: "PluralBuddy",
};
 

export default async function AuthorizedAppsPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session === null) {
		return <DiscordLoginComponent />;
	}

	const data = await auth.api.getOAuthConsents({
		// This endpoint requires session cookies.
		headers: await headers(),
	});

	return (
		<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<SettingsSidebar page="apps" />
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				<Card className="w-full mb-4">
					<CardContent>
						<CardTitle>Applications</CardTitle>
						<CardDescription>
							PluralBuddy allows developers to interact with your system via the
							PluralBuddy API, built on OAuth 2.1. If an application is doing
							something it shouldn't be doing, you can remove any of them at any
							time.
						</CardDescription>
					</CardContent>
				</Card>
				<Separator className="mb-4" />
				<div className="grid grid-cols-1 gap-2">
					{data.length === 0 && (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<AppWindow />
								</EmptyMedia>
								<EmptyTitle>No Applications Yet</EmptyTitle>
								<EmptyDescription>
									You haven't authorized any OAuth applications for your user.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
					{data.map((v) => (
						<AuthorizedAppsCard app={v} key={v.clientId} />
					))}
				</div>
			</div>
		</main>
	);
}
