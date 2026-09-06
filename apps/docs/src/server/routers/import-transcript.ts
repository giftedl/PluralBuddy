import { ObjectId } from "mongodb";
import { revalidateTag, unstable_cache } from "next/cache";
import { PAlter, PImportTranscript, PTag, PUser } from "plurography";
import z from "zod";
import clientPromise from "../db";
import { baseProcedure, createTRPCRouter } from "../init";
import { router } from "../trpc";

const getCachedExport = unstable_cache(
	async (id) => {
		const mongo = await clientPromise;
		const db = mongo.db(
			`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
		);
		const [alterCollection, tagCollection, userCollection] = [
			db.collection<PAlter>("alters"),
			db.collection<PTag>("tags"),
			db.collection<PUser>("users"),
		];

		return {
			alters: await alterCollection.find({ systemId: id }).toArray(),
			system: (await userCollection.findOne({ userId: id }))?.system,
			tags: await tagCollection.find({ systemId: id }).toArray(),
		};
	},
	["pluralbuddy-export"],
	{
		// Revalidate after 30 minutes since the import transcripts also expire after 30 minutes
		revalidate: 1800,
	},
);

export const ImportTranscriptRouter = createTRPCRouter({
	getImportTranscript: baseProcedure
		.input(z.object({ id: z.string() }))
		.query(async ({ ctx, input }) => {
			if (!ctx.discordAccountId) throw new Error("Session error.");

			const importTranscriptDb =
				ctx.botDatabase.collection<PImportTranscript>("import-transcripts");
			const importTranscript = await importTranscriptDb.findOne({
				userId: ctx.discordAccountId,
				_id: new ObjectId(input.id),
			});

			return importTranscript;
		}),
	getOldData: baseProcedure.query(async ({ ctx }) => {
		if (!ctx.discordAccountId) throw new Error("Session error.");

		const exportData = await getCachedExport(ctx.discordAccountId);

		return exportData;
	}),
});
