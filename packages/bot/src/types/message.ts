/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export const PMessageObject = z.object({
    messageId: z.string(),
    systemId: z.string(),
    alterId: z.number(),
    createdAt: z.date(),
    channelId: z.string(),
    guildId: z.string().optional()
})

export type PMessage = z.infer<typeof PMessageObject>