import z from "zod";
import { OpenPluralSourceRef } from "../source-ref";

export const OpenPluralFrontComment = z.object({
	id: z.uuid(),
	system_id: z.uuid(),
	front_period_id: z.uuid().nullable(),
	front_event_id: z.uuid().nullable(),
	target_time: z.coerce.date(),
	author_member_id: z.uuid().nullable(),
	body: z.string(),
	created_at: z.coerce.date(),
	edited_at: z.coerce.date().nullable(),
	source_refs: OpenPluralSourceRef.array(),
	extensions: z.record(z.string(), z.unknown()),
});
