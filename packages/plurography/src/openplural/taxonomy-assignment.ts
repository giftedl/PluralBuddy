import z from "zod";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralTaxonomyAssignment = z.object({
	id: z.uuid(),
	term_id: z.uuid(),
	subject_type: z.enum(["member", "note", "asset", "front_period", "custom"]),
	subject_id: z.uuid(),
	scope: z.enum(["profile", "appearance", "session", "custom"]).nullable(),
	source_refs: OpenPluralSourceRef.array(),
    extensions: z.record(z.string(), z.unknown())
});