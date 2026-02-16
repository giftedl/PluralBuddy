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
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { getImportDataById } from "@/lib/get-import";
import { ArrowUpRightIcon, CloudDownload } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ImportStagingPage({
	searchParams,
}: {
	searchParams: Promise<{ id: string }>;
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const importData = await getImportDataById((await searchParams).id);

	if (session === null) {
		return <DiscordLoginComponent />;
	}
	const accountId = await getDiscordIdBySessionId(session.user.id);

	return (
		<main className="flex w-full flex-1 flex-col gap-6 px-4 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<div className="max-md:space-y-3 items-center gap-6 w-full">
				<Card
					className={
						importData === null || importData.originatingSystemId !== accountId
							? "flex w-full items-center justify-center h-[calc(100vh-300px)]"
							: "h-[calc(100vh-90px)] overflow-y-auto"
					}
				>
					<CardContent
						className={
							importData === null ||
							importData.originatingSystemId !== accountId
								? "text-sm flex items-center justify-center h-full"
								: " h-full w-full relative"
						}
					>
						{importData === null ||
						importData.originatingSystemId !== accountId ? (
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
									{importData === null ? (
										"An import staging request with this interaction ID could not be found."
									) : (
										<>
											PluralBuddy allows you to upload large quantities of data
											in order to import to your system. You have selected the{" "}
											<b>{importData.importMode}</b> import mode as the method
											to import data into your system.
										</>
									)}
								</span>
								{importData && (
									<div>
										<Separator className="my-3" />
										<ImportDataForm importData={importData} />
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
