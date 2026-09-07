import { MultiFileDiff } from "@pierre/diffs/react";
import { PSystemObject } from "plurography";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { sortObject } from "../sort-object";
import { ChangesSectionWidgetData } from ".";

export function ImportTranscriptSystemWidget({
	importTranscript,
	allSystemData,
    destructive
}: ChangesSectionWidgetData<true>) {
	return (
		<Card id="system">
			<CardContent className="w-full">
				<CardTitle>System</CardTitle>

				<div className="border rounded-lg p-2 mt-4 ">
					<div className="rounded-lg bg-[#1B1E28] p-1">
						<MultiFileDiff
							className="rounded-xl *:rounded-lg"
							// We automatically detect the language based on filename
							oldFile={{
								name: "system.json",
								contents: JSON.stringify(
									sortObject(PSystemObject.parse(allSystemData.system)),
									null,
									2,
								),
							}}
							newFile={{
								name: "system.json",
								contents: JSON.stringify(
									sortObject(
										PSystemObject.parse(
											destructive
												? importTranscript.system.destructive
												: importTranscript.system.nondestructive,
										),
									),
									null,
									2,
								),
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
}
