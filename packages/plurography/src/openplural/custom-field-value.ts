import z from "zod";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralCustomFieldValue = z.object({
    id: z.uuid(),
    field_id: z.uuid(),
    subject_type: z.enum(["member", "system"]),
    subject_id: z.uuid(),
    value: z.unknown(),
    source_refs: OpenPluralSourceRef.array(),
    extensions: z.record(z.string(), z.unknown())
})