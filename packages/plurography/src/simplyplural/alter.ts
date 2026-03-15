import { z } from "zod";

export const SimplyPluralMember = z.object({
    exists: z.boolean(),
    id: z.string(),
    content: z.object({
        name: z.string(),
        desc: z.string(),
        pronouns: z.string(),
        pkId: z.string(),
        color: z.string(),


        avatarUrl: z.string(),
        avatarUuid: z.string(),
        preventsFrontNotifs: z.boolean(),

        private: z.boolean(),
        preventTrusted: z.boolean(),
        supportDescMarkdown: z.boolean(),
        archived: z.boolean(),
        receiveMessageBoardNotifs: z.boolean(),
        archivedReason: z.string(),
        frame: z.object({
            bgShape: z.string(),
            bgClip: z.string(),
            bgStartColor: z.string(),
            bgEndColor: z.string(),
            avatarUuid: z.string().optional(),
        }),
        info: z.record(z.string(), z.string()).optional(),

        uid: z.string(),
        lastOperationTime: z.coerce.date(),
        buckets: z.string().array(),
    })
})