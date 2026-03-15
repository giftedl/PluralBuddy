import z from "zod";

export const SimplyPluralGroup = z.object({
    exists: z.boolean(),
    id: z.string(),
    content: z.object({
        parent: z.string(),
        name: z.string(),
        color: z.string(),
        desc: z.string(),
        emoji: z.string(),
        supportDescMarkdown: z.boolean(),
        members: z.string().array(),
        uid: z.string(),
        lastOperationTime: z.coerce.date(),
        buckets: z.string().array()
    })
})