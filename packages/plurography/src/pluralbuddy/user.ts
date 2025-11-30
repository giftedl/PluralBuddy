/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PSystemObject, type PSystem } from "./system";
import { assetStringGeneration } from "./operation";

export const PUserObject = z.object({
    userId: z.string(),

    system: PSystemObject.optional(),
    storagePrefix: z.string(),
    blacklisted: z.boolean().default(false)
})

export type PUser = z.infer<typeof PUserObject>

export const defaultUserStructure = (userId: string) => {
    return {
        userId,
        blacklisted: false,
        storagePrefix: assetStringGeneration(8)
    } satisfies PUser
}