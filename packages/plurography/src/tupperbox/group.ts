/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import z from "zod";

export const TupperBoxGroup = z.object({
  id: z.number(),
  name: z.string(),
  avatar: z.string().nullable(),
  description: z.string().nullable(),
  tag: z.string().nullable(),
});
