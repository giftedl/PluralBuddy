/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { assetStringGeneration } from "./operation";
import { PSystemObject } from "./system";

export const PUserObject = z.object({
	userId: z.string(),

	userLang: z.string().optional().default("en"),
	system: PSystemObject.optional(),
	storagePrefix: z.string(),
	blocked: z.boolean().default(false),
	policyStatus: z.number().default(0).optional(),
	nudging: z
		.object({
			blockedUsers: z.string().array(),
			currentlyEnabled: z.boolean(),
			dmReply: z.boolean().default(false),
		})
		.default({
			blockedUsers: [],
			currentlyEnabled: true,
			dmReply: false,
		}),

	syncConfiguration: z.record(
		z.string(),
		z.object({
			automatic: z.object({ destructive: z.boolean().default(false), enabled: z.boolean().default(false) }) ,
			writeBack: z.object({ destructive: z.boolean().default(false), enabled: z.boolean().default(false) }) ,
			token: z.object({ v: z.string(), i: z.string() }).optional(),
            lastSynced: z.coerce.date().optional(),

		}),
	).optional(),
});

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