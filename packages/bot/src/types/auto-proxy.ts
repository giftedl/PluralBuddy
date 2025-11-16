/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod"

export const PAutoProxyObj = z.object({
    autoproxyMode: z.enum([ "off", "latch", "member" ]),
    autoproxyAlter: z.string().optional(),
    serverId: z.string(),
    
    lastLatchTimestamp: z.date().optional()
})

export type PAutoProxy = z.infer<typeof PAutoProxyObj>