import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useTRPCClient } from "@/server/client";
import { BreadcrumbWrapper } from "../../breadcrumb-wrapper";
import { DynamicPageTitle } from "../../dynamic-title";

export default function ImportTranscriptsPage() {
	const { id } = useParams();
	const trpc = useTRPCClient();

	const { data: importTranscript, isPending: importTranscriptPending } =
		useQuery({
			queryKey: [`import-transcript/${id}`],
			queryFn: async () =>
				trpc.import_transcripts.getImportTranscript.query({ id: id ?? "" }),
		});

	if (importTranscriptPending)
		return (
			<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
				<DynamicPageTitle title="Viewing Import Transcript • PluralBuddy App" />
				<div className="fixed block top-[50%] right-[50%]">
					<Spinner />
				</div>
			</main>
		);

	return (
		<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
			<BreadcrumbWrapper>
				<BreadcrumbItem>
					<BreadcrumbLink href="/app/settings/express">
						Import Transcript
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator />
				<BreadcrumbItem>
					<BreadcrumbLink
						href={`/app/settings/sync/transcript/${id}`}
						className="font-mono"
					>
						{id}
					</BreadcrumbLink>
				</BreadcrumbItem>
			</BreadcrumbWrapper>
			<Card>
				
			</Card>
		</main>
	);
}
