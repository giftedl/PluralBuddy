/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export const PAutoProxyObj = z.object({
  autoproxyMode: z.enum(["off", "latch", "alter"]).or(z.string()),
  autoproxyAlter: z.string().optional().nullable(),
  serverId: z.string(),

  lastLatchTimestamp: z.coerce.date().optional().nullable(),
});

export type PAutoProxy = z.infer<typeof PAutoProxyObj>;
