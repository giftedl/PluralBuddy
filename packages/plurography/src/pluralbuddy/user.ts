/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { assetStringGeneration } from "./operation";
import { PSystemObject } from "./system";
import { PTerminology } from "./terminology";

export const PUserObject = z.object({
    userId: z.string(),

    userLang: z.string().optional().default("en"),
    system: PSystemObject.optional(),
    storagePrefix: z.string(),
    blocked: z.boolean().default(false),
    policyStatus: z.number().default(0).optional(),
    terminology: PTerminology,
    nudging: z.object({
        blockedUsers: z.string().array(),
        currentlyEnabled: z.boolean(),
        dmReply: z.boolean().default(false),
    }).default({
        blockedUsers: [],
        currentlyEnabled: true,
        dmReply: false,
    })
})

export type PUser = z.infer<typeof PUserObject>

export const defaultUserStructure = (userId: string) => {
    return {
        userId,
        blocked: false,
        userLang: "en",
        storagePrefix: assetStringGeneration(8),
        nudging: {
            blockedUsers: [],
            currentlyEnabled: true,
            dmReply: false
        }
    } satisfies PUser
}