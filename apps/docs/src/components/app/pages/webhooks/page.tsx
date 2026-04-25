import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { DynamicPageTitle } from "../../dynamic-title";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { AppPortal } from "svix-react";

import "svix-react/style.css";
import { useTRPCClient } from "@/server/client";

export default function WebhooksAppPage() {
	return (
		<main className="flex w-full flex-1 flex-col gap-6 md:md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<DynamicPageTitle title="Webhooks • PluralBuddy App" />
			<Card className="w-full">
				<CardContent>
					<Breadcrumb className="text-left">
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink>Settings</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="/app/settings/webhooks">
									Webhooks
								</BreadcrumbLink>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</CardContent>
			</Card>
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				<Card className="w-full mb-4">
					<CardContent>
						<CardTitle>Webhooks</CardTitle>
						<CardDescription>
							PluralBuddy allows developers to interact with your system via the
							PluralBuddy API, built on OAuth 2.1. If an application is doing
							something it shouldn't be doing, you can remove any of them at any
							time.
						</CardDescription>
					</CardContent>
				</Card>
				<Separator className="mb-4" />
				<SvixEmbed />
			</div>
		</main>
	);
}

const SvixEmbed = () => {
	const [appPortal, setAppPortal] = React.useState<string | null>(null);
	const t = useTRPCClient();

	React.useEffect(() => {
		const run = t.getSvixUrl.query();

		run.then((v) => setAppPortal(v));
	}, [t]);

	return <AppPortal url={appPortal} />;
};
