"use server";

import { api } from "@/lib/rpc";
import { MongoClient } from "mongodb";
import { ImportStage } from "plurography";
import z from "zod";

const MarkImportStagingInput = z.object({
	from: z.enum(["PluralBuddy", "PluralKit", "TupperBox"], {
		error: "You must select a valid option.",
	}),
	importStagingId: z.string(),
	data: z
		.string()
		.min(20, "Import must be at least 20 characters.")
		.refine(
			(val) => {
				try {
					JSON.parse(val);
				} catch {
					return false;
				}
				return true;
			},
			{ error: "Must be valid JSON." },
		),
});

export async function markImportStagingDone(
	input: z.infer<typeof MarkImportStagingInput>,
) {
	const data = MarkImportStagingInput.safeParse(input);

	if (data.error) throw new Error("validation error.");

	const mongo = new MongoClient(process.env.MONGO ?? "");
	const importStaging = await mongo
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection<ImportStage>("import-staging")
		.updateOne(
			{ "webhook.id": input.importStagingId },
			{
				$set: {
					response: {
						data: data.data.data,
						dataType: data.data.from,
					},
				},
			},
		);

	await api["import-staging-reminder"].$post({
		json: { importStageId: input.importStagingId },
	});
}
