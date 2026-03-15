import z from "zod";

export const SimplyPluralSystem = z.object({
    exists: z.boolean(),
    id: z.string(),
    content: z.object({
        uid: z.string(),
        isAsystem: z.boolean(),
        lastOperationTime: z.coerce.date(),
        username: z.string(),
        avatarUrl: z.string(),
        avatarUuid: z.string().optional(),
        color: z.string(),
        desc: z.string(),
        frame: z.any(),
        supportDescMarkdown: z.boolean(),
        fields: z.record(z.string(), z.object({
            name: z.string(),
            order: z.number(),
            private: z.boolean(),
            type: z.number(),
            preventTrusted: z.boolean()
        }))
    })
})