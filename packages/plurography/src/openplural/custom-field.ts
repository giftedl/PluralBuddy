import z from "zod";
import { OpenPluralPrivacy } from "./privacy";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralCustomField = z.object({
	id: z.uuid(),
	system_id: z.uuid(),
	name: z.string(),
	field_type: z.string(),
	options: z.array(z.string()).or(z.record(z.string(), z.unknown())).nullable(),
	supports_markdown: z.boolean().default(true),
	date_precision: z.enum(["day", "month", "year", "month_day"]).nullable(),
	sort_order: z.number().nullable(),
	privacy: OpenPluralPrivacy,
    source_refs: OpenPluralSourceRef.array(),
    extensions: z.record(z.string(), z.unknown()),
});