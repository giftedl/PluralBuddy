import { MultiFileDiff } from "@pierre/diffs/react";
import { Minus, Pencil, Plus } from "lucide-react";
import { PAlterObject } from "plurography";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { sortObject } from "../sort-object";
import { ChangesSectionWidgetData } from ".";

export function AltersWidget({
	importTranscript,
	destructive,
	allSystemData,
}: ChangesSectionWidgetData<true>) {
	return (
		<div className="w-full grid gap-4">
			<h2 className="text-lg font-bold" id="alters">
				Alters
			</h2>
			{...[
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
				const oldAlter = allSystemData.alters.find(
					(c) => Number(c.alterId) === Number(v.alterId),
				);
				const newAlter = [
					...importTranscript.alters.add,
					...importTranscript.alters.update,
				].find((c) => c.alterId === v.alterId);

				const alterIcon = importTranscript.alters.add.some(
					(c) => c.alterId === v.alterId,
				) ? (
					<Plus className="text-green-400" />
				) : importTranscript.alters.update.some(
						(c) => c.alterId === v.alterId,
					) ? (
					<Pencil className="text-yellow-400 size-4" />
				) : (
					<Minus className="text-red-400" />
				);

				return (
					<Card key={v.alterId}>
						<CardContent className="w-full">
							<div className="flex items-center justify-between w-full">
								<CardTitle id={`alter-${v.alterId}`}>
									@{possibleAlter?.username}
								</CardTitle>
								{alterIcon}
							</div>

							<div className="border rounded-lg p-2 mt-4 ">
								<div className="rounded-lg bg-[#1B1E28] p-1">
									<MultiFileDiff
										className="rounded-xl *:rounded-lg"
										// We automatically detect the language based on filename
										oldFile={{
											name: `alters/${v.alterId}.json`,
											contents: oldAlter
												? JSON.stringify(
														sortObject(PAlterObject.parse(oldAlter)),
														null,
														2,
													)
												: "",
										}}
										newFile={{
											name: `alters/${v.alterId}.json`,
											contents: newAlter
												? JSON.stringify(
														sortObject(PAlterObject.parse(newAlter)),
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
		</div>
	);
}
