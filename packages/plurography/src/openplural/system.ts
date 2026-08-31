import z from "zod";
import { OpenPluralPrivacy } from "./privacy";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralSystem = z.object({
	id: z.uuid(),
	name: z.string(),
	display_name: z.string().nullable(),
	description: z.string().nullable(),
	tag: z.string().nullable(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.nullable(),
	avatar_asset_id: z.uuid().nullable(),
	banner_asset_id: z.uuid().nullable(),
	parent_system_id: z.uuid().nullable(),
	archived: z.boolean().default(false),
	privacy: OpenPluralPrivacy,
	settings: z.record(z.string(), z.unknown()),
	source_refs: OpenPluralSourceRef.array(),
	extensions: z.record(z.string(), z.unknown()),
});
