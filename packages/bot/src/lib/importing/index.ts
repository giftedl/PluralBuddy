import { PAlterObject, PTagObject } from "plurography";
import z from "zod";

export const ImportEntry = z.object({
	alters: PAlterObject.array().max(2000),
	tags: PTagObject.array().max(500),
	userId: z.string(),
});

export const ImportOutput = z.object({
	alters: PAlterObject.array().max(2000),
	tags: PTagObject.array().max(500),
	userId: z.string(),

	affected: z.object({
		alters: z.number(),
		tags: z.number(),
	}),
});
