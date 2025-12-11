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
    disabled: z.boolean().catch(false).default(false),

    systemName: z.string().max(20).min(1),
    systemDisplayTag: z.string().optional(),
    systemDescription: z.string().max(2000).optional().catch(""),
    systemAvatar: z.string().optional().nullable().catch(""),
    systemBanner: z.string().optional().nullable().catch(""),
    systemPronouns: z.string().optional(),

    nicknameFormat: z.string().optional().catch(undefined),

    alterIds: z.array(z.number()).max(2000).default([]),
    tagIds: z.array(z.string()).max(500).default([]),
    createdAt: z.coerce.date(),

    systemAutoproxy: z.array(PAutoProxyObj),
    systemOperationDM: z.boolean().default(true),

    public: z.number(),
    subAccounts: z.array(z.string()).catch([])
})

export type PSystem = z.infer<typeof PSystemObject>