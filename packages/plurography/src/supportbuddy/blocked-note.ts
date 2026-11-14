/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import z from "zod";

export const PBlockNoteObj = z.object({
  note: z.string(),
  associatedUserId: z.string(),
  date: z.coerce.date(),
  moderatorId: z.string(),
});

export type PBlockNote = z.infer<typeof PBlockNoteObj>;
