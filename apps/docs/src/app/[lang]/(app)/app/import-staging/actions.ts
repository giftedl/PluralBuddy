"use server";

import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { api } from "@/lib/rpc";
import { MongoClient } from "mongodb";
import { headers } from "next/headers";
import {
	ImportNotation,
	ImportStage,
	PluralKitSystem,
	TupperBoxSystem,
} from "plurography";
import z from "zod";

const MarkImportStagingInput = z
	.object({
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
	})
	.refine(
		(val) => {
			try {
				JSON.parse(val.data);
			} catch {
				return false;
			}
			if (
				val.from === "PluralKit" &&
				PluralKitSystem.safeParse(JSON.parse(val.data)).error
			) {
				return false;
			}
			if (
				val.from === "PluralBuddy" &&
				ImportNotation.safeParse(JSON.parse(val.data)).error
			) {
				return false;
			}
			if (
				val.from === "TupperBox" &&
				TupperBoxSystem.safeParse(JSON.parse(val.data)).error
			) {
				return false;
			}

			return true;
		},
		{ error: "Configuration is not consistent with import type." },
	);

export async function markImportStagingDone(
	input: z.infer<typeof MarkImportStagingInput>,
) {
	const data = MarkImportStagingInput.safeParse(input);
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	console.log(data.error);
	if (data.error) throw new Error("validation error.");

	if (!session)
		throw new Error("Session error.");

	const mongo = new MongoClient(process.env.MONGO ?? "");
	const staging = await mongo
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection<ImportStage>("import-staging")
		.findOne(
			// @ts-ignore
			{ "webhook.id": input.importStagingId });

	if (staging?.originatingSystemId !== await getDiscordIdBySessionId(session.user.id)) {
		throw new Error("Session doesn't match staging.");
	}
	
	await mongo
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection<ImportStage>("import-staging")
		.updateOne(
			// @ts-ignore
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

	return { done: true };
}
