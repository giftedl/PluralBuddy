/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PAutoProxyObj, type PAutoProxy } from "./auto-proxy";


type Protected = { protected: true };

export enum SystemProtectionFlags {
    NAME          = 1 << 0,
    DISPLAY_TAG   = 1 << 1,
    DESCRIPTION   = 1 << 2,
    AVATAR        = 1 << 3,
    BANNER        = 1 << 4,
    PRONOUNS      = 1 << 5,
    ALTERS        = 1 << 6,
    TAGS          = 1 << 7
}

export const PSystemObject = z.object({
    associatedUserId: z.string(),

    systemName: z.string().max(20).min(3),
    systemDisplayTag: z.string().optional(),
    systemDescription: z.string().max(1000).optional(),
    systemAvatar: z.string().optional(),
    systemBanner: z.string().optional(),
    systemPronouns: z.string().optional(),

    nicknameFormat: z.string().optional(),

    alterIds: z.array(z.number()).default([]),
    tagIds: z.array(z.string()).default([]),
    createdAt: z.coerce.date(),

    systemAutoproxy: z.array(PAutoProxyObj),
    systemOperationDM: z.boolean().default(false),

    public: z.number(),
    subAccounts: z.array(z.string())
})

export type PSystem = z.infer<typeof PSystemObject>