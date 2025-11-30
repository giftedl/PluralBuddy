/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export const TupperBoxGroup = z.object({
    id: z.number(),
    name: z.string(),
    avatar: z.string().nullable(),
    description: z.string().nullable(),
    tag: z.string().nullable()
})