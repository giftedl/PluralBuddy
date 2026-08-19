import z from "zod";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralNote = z.object({
	id: z.uuid(),
	system_id: z.uuid(),
	member_id: z.uuid().nullable(),
	title: z.string().nullable(),
	body: z.string(),
	created_at: z.coerce.date(),
	updated_at: z.coerce.date().nullable(),
	entry_date: z.date().nullable(),
	author_member_ids: z.uuid().array(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.nullable(),
	visibility: z.enum(["private", "system", "friends", "trusted", "public"]).nullable(),
    pinned: z.boolean().default(false),
    content_warning: z.string().nullable(),
    attachment_asset_ids: z.uuid().array(),
    source_refs: OpenPluralSourceRef.array(),
    extensions: z.record(z.string(), z.unknown())
});
