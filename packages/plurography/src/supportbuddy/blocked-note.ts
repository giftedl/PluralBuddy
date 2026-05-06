/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export const PBlockNoteObj = z.object({
    note: z.string(),
    associatedUserId: z.string(),
    date: z.coerce.date(),
    moderatorId: z.string(),
})

export type PBlockNote = z.infer<typeof PBlockNoteObj>