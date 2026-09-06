import { MultiFileDiff } from "@pierre/diffs/react";
import { Minus, Pencil, Plus } from "lucide-react";
import {
	PAlter,
	PAlterObject,
	PImportTranscript,
	PSystem,
	PSystemObject,
	PTag,
	PTagObject,
} from "plurography";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { sortObject } from "../sort-object";
import { TOCSticky } from "../toc-sticky";
import { ImportTranscriptSystemWidget } from "./system";

export type ChangesSectionWidgetData = {
	importTranscript: PImportTranscript;
	allSystemData: {
		system: PSystem | undefined;
		alters: PAlter[];
		tags: PTag[];
	};
};



export function ChangesSection({
	importTranscript,
	allSystemData,
}: ChangesSectionWidgetData) {
	const [destructive, setDestructive] = useState(true);

	return (
		<TOCSticky
			destructive={destructive}
			setDestructive={setDestructive}
			toc={[
				{ title: "System", url: "#system", depth: 2 },
				{ title: "Alters", url: "#alters", depth: 2 },
				...[
					...importTranscript.alters.add,
					...(destructive ? importTranscript.alters.remove : []),
					...importTranscript.alters.update,
				].map((v) => {
					const possibleAlter =
						[
							...importTranscript.alters.add,
							...importTranscript.alters.update,
						].find((c) => c.alterId === v.alterId) ??
						allSystemData.alters.find((c) => c.alterId === Number(v.alterId));

					return {
						title: `Alter @${
							possibleAlter?.username ?? v.alterId
						} (${possibleAlter?.displayName})`,
						url: `#alter-${v.alterId}`,
						depth: 3,
					};
				}),
				{ title: "Tags", url: "#tags", depth: 2 },
				...[
					...importTranscript.tags.add,
					...(destructive ? importTranscript.tags.remove : []),
					...importTranscript.tags.update,
				].map((v) => {
					const possibleTag =
						[
							...importTranscript.tags.add,
							...importTranscript.tags.update,
						].find((c) => c.tagId === v.tagId) ??
						allSystemData.tags.find((c) => c.tagId === v.tagId);

					return {
						title: `Tag ${possibleTag?.tagFriendlyName ?? v.tagId}`,
						url: `#tag-${v.tagId}`,
						depth: 3,
					};
				}),
			]}
		>
            <ImportTranscriptSystemWidget importTranscript={importTranscript} allSystemData={allSystemData}/>
			<Separator />
			<h2 className="text-lg font-bold" id="tags">
				Tags
			</h2>

			{...[
				...importTranscript.tags.add,
				...(destructive ? importTranscript.tags.remove : []),
				...importTranscript.tags.update,
			].map((v) => {
				const possibleTag =
					[...importTranscript.tags.add, ...importTranscript.tags.update].find(
						(c) => c.tagId === v.tagId,
					) ?? allSystemData.tags.find((c) => c.tagId === v.tagId);
				const oldTag = allSystemData.alters.find(
					(c) => Number(c.alterId) === Number(v.tagId),
				);
				const newTag = [
					...importTranscript.tags.add,
					...importTranscript.tags.update,
				].find((c) => c.tagId === v.tagId);

				const tagIcon = importTranscript.tags.add.some(
					(c) => c.tagId === v.tagId,
				) ? (
					<Plus className="text-green-400" />
				) : importTranscript.tags.update.some((c) => c.tagId === v.tagId) ? (
					<Pencil className="text-yellow-400 size-4" />
				) : (
					<Minus className="text-red-400" />
				);

				return (
					<Card key={v.tagId}>
						<CardContent className="w-full">
							<div className="flex items-center justify-between w-full">
								<CardTitle id={`tag-${v.tagId}`}>
									{possibleTag?.tagFriendlyName}
								</CardTitle>
								{tagIcon}
							</div>

							<div className="border rounded-lg p-2 mt-4 ">
								<div className="rounded-lg bg-[#1B1E28] p-1">
									<MultiFileDiff
										className="rounded-xl *:rounded-lg"
										// We automatically detect the language based on filename
										oldFile={{
											name: `tags/${v.tagId}.json`,
											contents: oldTag
												? JSON.stringify(
														sortObject(PTagObject.parse(oldTag)),
														null,
														2,
													)
												: "",
										}}
										newFile={{
											name: `tags/${v.tagId}.json`,
											contents: newTag
												? JSON.stringify(
														sortObject(PTagObject.parse(newTag)),
														null,
														2,
													)
												: "",
										}}
										options={{
											theme: "poimandres",
										}}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</TOCSticky>
	);
}
