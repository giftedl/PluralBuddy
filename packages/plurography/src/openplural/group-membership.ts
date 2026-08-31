import z from "zod";
import { OpenPluralSourceRef } from "./source-ref";

export const OpenPluralGroupMembership = z.object({
    id: z.uuid(),
    group_id: z.uuid(),
    member_id: z.uuid(),
    sort_order: z.number().nullable(),
    source_refs: OpenPluralSourceRef.array(),
})