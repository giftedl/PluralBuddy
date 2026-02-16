import { PAlterObject, PTagObject } from "plurography";
import z from "zod";

export const ImportEntry = z.object({
	alters: PAlterObject.array().max(2000),
	tags: PTagObject.array().max(500),
	userId: z.string(),
});
