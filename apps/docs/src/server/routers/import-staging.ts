import z from "zod";
import { baseProcedure } from "../init";
import { router } from "../trpc";
import {
	ImportNotation,
	ImportStage,
	PluralKitSystem,
	TupperBoxSystem,
} from "plurography";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { api } from "@/lib/rpc";
import { waitUntil } from "@vercel/functions";

export const ImportStagingRouter = router({
	markImportStagingDone: baseProcedure
		.input(
			z
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
				),
		)
		.query(async ({ ctx, input }) => {
			const session = await auth.api.getSession({
				headers: await headers(),
			});

			if (!session) throw new Error("Session error.");

			const mongo = new MongoClient(process.env.MONGO ?? "");
			const staging = await mongo
				.db(`${process.env.ENV}-pluralbuddy-app`)
				.collection<ImportStage>("import-staging")
				.findOne(
					// @ts-ignore
					{ "webhook.id": input.importStagingId },
				);

			if (
				staging?.originatingSystemId !==
				(await getDiscordIdBySessionId(session.user.id))
			) {
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
								data: input.data,
								dataType: input.from,
							},
						},
					},
				);

			await api["import-staging-reminder"].$post({
				json: { importStageId: input.importStagingId },
			});

			return { done: true };
		}),
	getImportData: baseProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			const mongoClient = new MongoClient(process.env.MONGO ?? "");
			const mongoDb = mongoClient.db(`${process.env.ENV}-pluralbuddy-app`);

			let result = (await mongoDb
				.collection<ImportStage>("import-staging")
				.findOne({ "webhook.id": input.id })) as ImportStage;

			if (result) {
				result = {
					...result,
					_id: null,
					webhook: { id: input.id, token: "redacted" },
				} as ImportStage;
			}

			waitUntil(mongoClient.close());

			return result;
		}),
});
