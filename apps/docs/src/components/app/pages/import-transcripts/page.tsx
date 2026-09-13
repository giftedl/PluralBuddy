import { File, FileDiff, MultiFileDiff } from "@pierre/diffs/react";
import { useQuery } from "@tanstack/react-query";
import { TOCItemType } from "fumadocs-core/toc";
import { ReactElement } from "hono/jsx";
import {
	Minus,
	Pencil,
	Plus,
	SearchAlert,
	SkipBack,
	SkipForward,
	Users,
	X,
} from "lucide-react";
import { useScroll } from "motion/react";
import { PAlterObject, PSystemObject, PTagObject } from "plurography";
import React, { ReactNode, useEffect, useState } from "react";
import Markdown from "react-markdown";
import { Link, useParams } from "react-router";
import fa from "zod/v4/locales/fa.cjs";
import { TOC, TOCProvider } from "@/components/layouts/docs/page/slots/toc";
import {
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTRPCClient } from "@/server/client";
import { BreadcrumbWrapper } from "../../breadcrumb-wrapper";
import { DynamicPageTitle } from "../../dynamic-title";
import { ChangesSection } from "./changes";
import { sortObject } from "./sort-object";
import { TOCSticky } from "./toc-sticky";
import { TranscriptStat } from "./transcript-stat";

const systemKeys = [
	{
		key: "systemName",
		friendly: "System Name",
	},
	{
		key: "systemDescription",
		friendly: "System Description",
	},
	{
		key: "systemAvatar",
		friendly: "System Avatar URL",
	},
	{
		key: "systemBanner",
		friendly: "System Banner URL",
	},
	{
		key: "systemPronouns",
		friendly: "System Pronouns",
	},
];

export default function ImportTranscriptsPage() {
	const { id } = useParams();
	const trpc = useTRPCClient();

	const { data: importTranscript, isPending: importTranscriptPending } =
		useQuery({
			queryKey: [`import-transcript/${id}`],
			queryFn: async () =>
				trpc.import_transcripts.getImportTranscript.query({ id: id ?? "" }),
		});
	const { data: allSystemData, isPending: allSystemDataPending } = useQuery({
		queryKey: [`all-system-data`],
		queryFn: async () => trpc.import_transcripts.getOldData.query(),
	});

	if (importTranscriptPending || allSystemDataPending)
		return (
			<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
				<DynamicPageTitle title="Viewing Import Transcript • PluralBuddy App" />
				<div className="fixed block top-[50%] right-[50%]">
					<Spinner />
				</div>
			</main>
		);

	if (!importTranscript || !allSystemData)
		return (
			<React.Fragment>
				<DynamicPageTitle title="Unknown Import Transcript • PluralBuddy App" />
				<main className="flex w-full flex-1 flex-col gap-6 md:px-4 max-md:px-2 pt-18 items-center mx-auto max-w-[1000px] mb-3">
					<Card>
						<div className="align-center justify-center flex h-[calc(100vh-200px)] w-[100vh]">
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<SearchAlert />
									</EmptyMedia>
									<EmptyTitle>Couldn't find this import transcript</EmptyTitle>
									<EmptyDescription>
										Import transcripts automatically expire after 30 minutes if
										they are not actioned on.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</div>
					</Card>
				</main>
			</React.Fragment>
		);

	const alterCountAfterIncrease = {
		destructive:
			(allSystemData?.alters.length ?? 0) +
			importTranscript.alters.add.length -
			importTranscript.alters.remove.length,
		nonDestructive:
			(allSystemData?.alters.length ?? 0) + importTranscript.alters.add.length,
	};
	const tagCountAfterIncrease = {
		destructive:
			allSystemData.tags.length +
			importTranscript.tags.add.length -
			importTranscript.tags.remove.length,
		nonDestructive:
			allSystemData.tags.length + importTranscript.tags.add.length,
	};

	const alterCountPercentage = {
		destructive:
			(100 *
				(alterCountAfterIncrease.destructive - allSystemData.alters.length)) /
			Math.abs(allSystemData.alters.length),
		nonDestructive:
			(100 *
				(alterCountAfterIncrease.nonDestructive -
					allSystemData.alters.length)) /
			Math.abs(allSystemData.alters.length),
	};
	const tagCountPercentage = {
		destructive:
			(100 * (tagCountAfterIncrease.destructive - allSystemData.tags.length)) /
			Math.abs(allSystemData.tags.length),
		nonDestructive:
			(100 *
				(tagCountAfterIncrease.nonDestructive - allSystemData.tags.length)) /
			Math.abs(allSystemData.tags.length),
	};

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
			<Card className="w-full">
				<CardContent>
					<Tabs defaultValue="alters" className="min-w-full">
						<TabsList className="mb-2 w-full">
							<TabsTrigger value="alters">Alters</TabsTrigger>
							<TabsTrigger value="tags">Tags</TabsTrigger>
							<TabsTrigger value="system">System</TabsTrigger>
						</TabsList>
						<div className="rounded-xl border p-4">
							<TabsContent value="alters">
								<div className="grid grid-cols-3 w-full *:px-3">
									<TranscriptStat
										icon={Plus}
										className="border-r"
										variant="add"
										value={importTranscript.alters.add.length}
										description={<>Created Alters</>}
									/>
									<TranscriptStat
										icon={Pencil}
										className="border-r"
										variant="update"
										value={importTranscript.alters.update.length}
										description={<>Updated Alters</>}
									/>
									<TranscriptStat
										icon={Minus}
										variant="remove"
										value={importTranscript.alters.update.length}
										description={<>Removed Alters</>}
									/>
								</div>
								<Separator className="my-6" />
								<PercentageStat
									countAfterIncrease={alterCountAfterIncrease.destructive}
									title="Alter count after sync"
									percentageAfterIncrease={alterCountPercentage.destructive}
								/>
								<PercentageStat
									countAfterIncrease={alterCountAfterIncrease.nonDestructive}
									title="Alter count after sync (destructive)"
									percentageAfterIncrease={alterCountPercentage.nonDestructive}
								/>
							</TabsContent>
							<TabsContent value="tags">
								<div className="grid grid-cols-3 w-full *:px-3">
									<TranscriptStat
										icon={Plus}
										className="border-r"
										variant="add"
										value={importTranscript.tags.add.length}
										description={<>Created Tags</>}
									/>
									<TranscriptStat
										icon={Pencil}
										className="border-r"
										variant="update"
										value={importTranscript.tags.update.length}
										description={<>Updated Tags</>}
									/>
									<TranscriptStat
										icon={Minus}
										variant="remove"
										value={importTranscript.tags.remove.length}
										description={<>Removed Tags</>}
									/>
								</div>
								<Separator className="my-6" />
								<PercentageStat
									countAfterIncrease={tagCountAfterIncrease.destructive}
									title="Tag count after sync"
									percentageAfterIncrease={tagCountPercentage.destructive}
								/>
								<PercentageStat
									countAfterIncrease={tagCountAfterIncrease.nonDestructive}
									title="Tag count after sync (destructive)"
									percentageAfterIncrease={tagCountPercentage.nonDestructive}
								/>
							</TabsContent>
							<TabsContent value="system">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-[100px]">Key</TableHead>
											<TableHead>
												<span className="flex items-center gap-2">
													<SkipBack className="size-4" />
													Previous
												</span>
											</TableHead>
											<TableHead>
												<span className="flex items-center gap-2">
													<SkipForward className="size-4" />
													New
												</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{systemKeys.map(({ key, friendly }) => (
											<TableRow key={key}>
												<TableCell className="font-medium">
													{friendly}
												</TableCell>
												<TableCell className="max-w-25 overflow-auto prose prose-headings:my-0! prose-p:my-0! prose-h1:text-lg!">
													<Markdown>
														{(
															allSystemData.system as unknown as Record<
																string,
																string
															>
														)[key] ?? "-"}
													</Markdown>
												</TableCell>
												<TableCell className="max-w-25 overflow-auto">
													<span className="flex items-center gap-2 prose prose-headings:my-0! prose-p:my-0! prose-h1:text-lg!">
														<span>
															<Markdown>
																{(
																	importTranscript.system
																		.destructive as unknown as Record<
																		string,
																		string
																	>
																)[key] ?? "-"}
															</Markdown>
														</span>{" "}
														{(
															importTranscript.system
																.destructive as unknown as Record<
																string,
																string
															>
														)[key] ===
															(
																allSystemData.system as unknown as Record<
																	string,
																	string
																>
															)[key] && (
															<span className="text-gray-400">(no change)</span>
														)}
													</span>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</TabsContent>
						</div>
					</Tabs>
				</CardContent>
			</Card>
			<Separator />
			<ChangesSection
				allSystemData={allSystemData}
				importTranscript={importTranscript}
			/>
		</main>
	);
}

function PercentageStat({
	countAfterIncrease,
	title,
	percentageAfterIncrease,
}: {
	countAfterIncrease: number;
	title: string;
	percentageAfterIncrease: number;
}) {
	return (
		<span className="flex items-center justify-between mb-2">
			<span className="font-bold">{title}</span>
			<span>
				{countAfterIncrease}{" "}
				<span
					className={cn(
						percentageAfterIncrease > 0 ? "text-green-400" : "text-red-400",
					)}
				>
					({percentageAfterIncrease > 0 && "+"}
					{Math.ceil(percentageAfterIncrease)}% change)
				</span>
			</span>
		</span>
	);
}
