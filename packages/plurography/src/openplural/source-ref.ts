import z from "zod";

export const OpenPluralSourceRef = z.object({
    app: z.string(),
    collection: z.string(),
    id: z.string(),
    uuid: z.string().nullable()
})