import z from "zod";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralGroup = z.object({
	id: z.uuid(),
	system_id: z.uuid(),
	name: z.string(),
	description: z.string().nullable(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.nullable(),
	emoji: z.string().nullable(),
	parent_group_id: z.uuid().nullable(),
	sort_order: z.number().nullable(),
	source_refs: OpenPluralSourceRef.array(),
	extensions: z.record(z.string(), z.unknown())
});
