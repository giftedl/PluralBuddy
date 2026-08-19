import z from "zod";
import { OpenPluralSourceRef } from "./source-ref";

export const TaxonomyKind = z.enum([
	"role",
	"tag",
	"source",
	"relationship",
	"identity",
	"topic",
	"status",
	"custom",
	"unknown",
]);

export const OpenPluralTaxonomyTerm = z.object({
	id: z.uuid(),
	system_id: z.uuid(),
	kind: TaxonomyKind.default("unknown"),
	name: z.string(),
	description: z.string().nullable(),
	color: z
		.string()
		.regex(/^#[0-9A-F]{6}$/i)
		.nullable(),
	parent_term_id: z.uuid().nullable(),
    source_refs: OpenPluralSourceRef.array(),
    extensions: z.record(z.string(), z.unknown())
});
