import { z } from "zod";
import { SimplyPluralGroup } from "./group";

export const SimplyPluralMember = z.object({
    exists: z.boolean(),
    id: z.string(),
    content: z.looseObject({
        name: z.string(),
        desc: z.string(),
        pronouns: z.string(),
        pkId: z.string().optional(),
        color: z.string(),


        avatarUrl: z.string().optional(),
        avatarUuid: z.string().optional(),
        preventsFrontNotifs: z.boolean().default(false),

        private: z.boolean().optional(),
        preventTrusted: z.boolean().optional(),
        supportDescMarkdown: z.boolean(),
        archived: z.boolean().default(false),
        receiveMessageBoardNotifs: z.boolean().optional(),
        archivedReason: z.string().optional(),
        frame: z.looseObject({
            bgShape: z.string().regex(/^[A-Za-z0-9]{0,50}$/).nullable().default(null),
            bgClip: z.string().regex(/^[A-Za-z0-9]{0,50}$/).nullable().default(null),
            bgStartColor: z.string().nullable().default(null),
            bgEndColor: z.string().nullable().default(null)
        }).optional(),
        info: z.record(z.string(), z.string()).optional(),

        uid: z.string(),
        lastOperationTime: z.coerce.date(),
        buckets: z.string().array(),
    })
})