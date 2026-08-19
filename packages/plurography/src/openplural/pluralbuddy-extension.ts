import z from "zod";

export const PluralBuddySystemExtension = z.object({
    keep_proxy_tags: z.boolean().nullable(),
    keep_pronouns: z.boolean().nullable(),
    no_typing_status: z.boolean().nullable(),
    prefer_accessiblity: z.boolean().nullable(),
    creation_date: z.date().nullable(),
    display_tag_map: z.record(z.string(), z.string()),
    system_operation_dm: z.boolean().nullable(),
}).optional().nullable()