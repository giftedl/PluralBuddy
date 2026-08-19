import z from "zod";
import { OpenPluralPrivacy } from "./privacy";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralMember = z.object({
	id: z.uuid(),
	system_id: z.uuid(),
	name: z.string().nullable(),
	display_name: z.string().nullable(),
	pronouns: z.string().nullable(),
	description: z.string().nullable(),
	age: z.string().nullable(),
	birthday: z
		.object({
			value: z.string(),
			precision: z.enum(["day", "month", "year", "month_day"]),
			year_visible: z.boolean().default(false),
		})
		.nullable(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.nullable(),
	avatar_asset_id: z.uuid().nullable(),
	banner_asset_id: z.uuid().nullable(),
	proxy_tags: z
		.object({
			prefix: z.string(),
			suffix: z.string(),
		})
		.array()
		.default([]),
	is_custom_front: z.boolean().default(false),
	archived: z.boolean().default(false),
	created_at: z.coerce.date(),
	sort_order: z.number().nullable(),
	privacy: OpenPluralPrivacy,
    source_refs: OpenPluralSourceRef.array(),
    extensions: z.record(z.string(), z.unknown())
});
