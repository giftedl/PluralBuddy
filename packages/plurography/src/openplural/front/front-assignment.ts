import z from "zod";
import { OpenPluralSourceRef } from "../source-ref";

export const OpenPluralFrontAssignment = z.object({
	member_id: z.uuid(),
	front_role: z.string(),
	confidence: z.number().nullable(),
	presence: z.string().or(z.enum(["present", "background", "muted", "asleep"])).nullable(),
    mood: z.string().nullable(),
    energy: z.string().nullable(),
    location: z.string().nullable(),
    note: z.string().nullable(),
    source_refs: OpenPluralSourceRef.array()
});
