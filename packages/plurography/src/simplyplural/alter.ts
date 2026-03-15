import { z } from "zod";

export const SimplyPluralMember = z.object({
    exists: z.boolean(),
    id: z.string(),
    content: z.looseObject({
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
            bgShape: z.string().regex(/^[A-Za-z0-9]{0,50}$/).nullable(),
            bgClip: z.string().regex(/^[A-Za-z0-9]{0,50}$/).nullable(),
            bgStartColor: z.string().nullable(),
            bgEndColor: z.string().nullable()
        }),
        info: z.record(z.string(), z.string()).optional(),

        uid: z.string(),
        lastOperationTime: z.coerce.date(),
        buckets: z.string().array(),
    })
})