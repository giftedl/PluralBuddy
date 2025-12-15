/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export const PMessageObject = z.object({
    messageId: z.string(),
    systemId: z.string(),
    alterId: z.number(),
    createdAt: z.date(),
    guildId: z.string().optional(),
    channelId: z.string()
})

export type PMessage = z.infer<typeof PMessageObject>