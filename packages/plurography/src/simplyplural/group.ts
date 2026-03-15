import z from "zod";

export const SimplyPluralGroup = z.object({
    exists: z.boolean(),
    id: z.string(),
    content: z.looseObject({
        parent: z.string(),
        color: z.string(),
        private: z.boolean().optional(),
        preventTrusted: z.boolean().optional(),
        name: z.string(),
        desc: z.string(),
        emoji: z.string(),
        members: z.string().array(),
        uid: z.string(),
        lastOperationTime: z.coerce.date(),
        buckets: z.string().array(),
        supportDescMarkdown: z.boolean(),
    })
})