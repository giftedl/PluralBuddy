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

export const PluralBuddyAlterExtension = z.object({
    webhook_avatar_url: z.string().nullable(),
    message_count: z.number().default(0),
    last_message: z.coerce.date().nullable(),
    alter_mode: z.enum(["webhook", "nickname", "both"]),
    proxy_tags_kept: z.boolean().default(false)
}).optional().nullable();