import { DiscordLoginComponent } from "@/components/discord-login";
import { ExpressAlterPage as ExpressAlter } from "@/components/pages/express-alter-page.client";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Spinner } from "@/components/ui/spinner";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { useParams } from "react-router";
import React from "react";
import { SettingsSidebar } from "@/components/settings-sidebar";
import { GroupIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useTRPCClient } from "@/server/client";
import { DynamicPageTitle } from "@/components/app/dynamic-title";

export default function ExpressAlterPage() {
	const trpc = useTRPCClient();
	const { alter } = useParams();
	const { data: alterObj, isPending: altersPending } = useQuery({
		queryKey: [`alter/${alter}`],
		queryFn: async () =>
			trpc.AlterRouter.getAlter.query({ id: alter ?? "", with_app_data: true }),
	});

	if (altersPending) return <Spinner />;

	if (!alterObj)
		return (
			<React.Fragment>
				<DynamicPageTitle title="Unknown Alter • PluralBuddy App" />
				<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">

					<Card>
						<div className="align-center justify-center flex h-[calc(100vh-200px)] w-[100vh]">
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<GroupIcon />
									</EmptyMedia>
									<EmptyTitle>Couldn't find this alter</EmptyTitle>
									<EmptyDescription>
										This alter may have been deleted.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</div>
					</Card>
				</main>
			</React.Fragment>
		);

	return <ExpressAlter alter={alterObj} />;
}
