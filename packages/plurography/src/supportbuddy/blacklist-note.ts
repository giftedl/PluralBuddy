/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export const PBlacklistNoteObj = z.object({
    note: z.string(),
    associatedUserId: z.string(),
    date: z.coerce.date(),
    moderatorId: z.string(),
})

export type PBlacklistNote = z.infer<typeof PBlacklistNoteObj>