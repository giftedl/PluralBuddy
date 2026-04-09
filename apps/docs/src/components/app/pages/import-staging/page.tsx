"use client";

import { ImportDataForm } from "@/components/app/import-data-form";
import { DiscordLoginComponent } from "@/components/discord-login";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { getImportDataById } from "@/lib/get-import";
import { useTRPCClient } from "@/server/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon, CloudDownload } from "lucide-react";
import { useParams, useSearchParams } from "react-router";

export default function ImportStagingPage() {
	const trpc = useTRPCClient();
	const [searchParams] = useSearchParams();

	const { data, isPending } = useQuery({
		queryKey: [`import-data/${searchParams.get("id")}`],
		queryFn: async () => trpc.import_staging.getImportData.query({ id: searchParams.get("id") ?? "" }),
	});

	const { data: discordId, isPending: isDiscordIdPending } = useQuery({
		queryKey: ["discord-id"],
		queryFn: async () => trpc.getDiscordId.query(),
	});

	if (isPending || isDiscordIdPending) return <Spinner />;

	const isInvalidSession =
		data === undefined ||
		data.originatingSystemId !== discordId ||
		data.response !== null;

	return (
		<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				<Card
					className={
						isInvalidSession
							? "flex w-full items-center justify-center h-[calc(100vh-300px)]"
							: "h-[calc(100vh-90px)] overflow-y-auto"
					}
				>
					<CardContent
						className={
							isInvalidSession
								? "text-sm flex items-center justify-center h-full"
								: " h-full w-full relative"
						}
					>
						{isInvalidSession ? (
							<Empty className="h-full w-full flex items-center justify-center">
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<CloudDownload />
									</EmptyMedia>
									<EmptyTitle>Import Data Not Found</EmptyTitle>
									<EmptyDescription>
										Data for this interaction ID regarding import data does not
										exist. Has it expired?
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						) : (
							<div>
								<strong className="text-lg block whitespace-nowrap mr-3">
									Upload Import Data
								</strong>
								<span className="min-w-0 block mt-2">
									{data === undefined ? (
										"An import staging request with this interaction ID could not be found."
									) : (
										<>
											PluralBuddy allows you to upload large quantities of data
											in order to import to your system. You have selected the{" "}
											<b>{data.importMode}</b> import mode as the method
											to import data into your system.
										</>
									)}
								</span>
								{data && (
									<div>
										<Separator className="my-3" />
										<ImportDataForm importData={data} />
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
