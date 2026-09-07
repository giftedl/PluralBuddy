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
import { AltersWidget } from "./alters";
import { ImportTranscriptSystemWidget } from "./system";
import { TagsWidget } from "./tags";

export type ChangesSectionWidgetData<Destructive extends boolean = false> = {
	importTranscript: PImportTranscript;
	allSystemData: {
		system: PSystem | undefined;
		alters: PAlter[];
		tags: PTag[];
	};
} & (Destructive extends true
	? {
			destructive: boolean;
		}
	: {});

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
			<ImportTranscriptSystemWidget
				importTranscript={importTranscript}
				allSystemData={allSystemData}
				destructive={destructive}
			/>
			<Separator />
			<AltersWidget
				importTranscript={importTranscript}
				allSystemData={allSystemData}
				destructive={destructive}
			/>
			<Separator />
            <TagsWidget
                importTranscript={importTranscript}
                allSystemData={allSystemData}
                destructive={destructive}
            />
		</TOCSticky>
	);
}
