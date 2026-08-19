import z from "zod";
import { OpenPluralSourceRef } from "../source-ref";
import { OpenPluralFrontAssignment } from "./front-assignment";

export const OpenPluralFrontEvent = z.object({
	id: z.uuid(),
	system_id: z.uuid(),
    at: z.coerce.date(),
    assignments: OpenPluralFrontAssignment.array(),
    note: z.string().nullable(),
    source_refs: OpenPluralSourceRef.array(),
    extensions: z.record(z.string(), z.unknown())
});