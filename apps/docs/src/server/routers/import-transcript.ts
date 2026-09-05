import { ObjectId } from "mongodb";
import { PImportTranscript } from "plurography";
import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { router } from "../trpc";

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
});
