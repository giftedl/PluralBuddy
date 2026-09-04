import z from "zod";
import { PAlterObject } from "./alter";
import { PSystemObject } from "./system";
import { PTagObject } from "./tag";

export const PImportTranscript = z.object({
	alters: z.object({
		add: PAlterObject.array(),
		update: PAlterObject.array(),
		remove: z.object({ alterId: z.string(), systemId: z.string() }).array(),
	}),
	tags: z.object({
		add: PTagObject.array(),
		update: PTagObject.array(),
		remove: z.object({ tagId: z.string(), systemId: z.string() }).array(),
	}),
    system: PSystemObject,

    createdAt: z.coerce.date(),
    userId: z.string(),
});

export type PImportTranscript = z.infer<typeof PImportTranscript>;