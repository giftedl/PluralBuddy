/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { z } from "zod";
import { alterCollection } from "../mongodb";

export enum AlterProtectionFlags {
    VISIBILITY     = 1 << 0,
    NAME           = 1 << 1,
    DESCRIPTION    = 1 << 2,
    BANNER         = 1 << 3,
    PRONOUNS       = 1 << 4,
    AVATAR         = 1 << 5,
    TAGS           = 1 << 7
}

export const PAlterObject = z.object({
    alterId: z.number(),
    systemId: z.string(),

    username: z.string().max(20).regex(/^[^\s]+$/),
    displayName: z.string().max(100),
    nameMap: z.object({ server: z.number(), name: z.string() }).array(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).nullable(),
    description: z.string().nullable(),
    created: z.coerce.date(),
    pronouns: z.string().nullable(),

    avatarUrl: z.string().nullable(),
    webhookAvatarUrl: z.string().nullable(),
    banner: z.string().nullable(),

    lastMessageTimestamp: z.coerce.date().nullable(),
    messageCount: z.number(),
    alterMode: z.enum([ "nickname", "webhook", "both" ]).default("webhook"),
    proxyTags: z.object({ prefix: z.string().max(20), suffix: z.string().max(20), id: z.string() }).array().default([])
})

export type PAlter = z.infer<typeof PAlterObject>

export async function getAlterById(id: string): Promise<PAlter | null> {
    return await alterCollection.findOne({ userId: id });
}