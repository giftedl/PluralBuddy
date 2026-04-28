/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { z } from "zod";


const publicDescription = `This is a bitwise operation-based number which determines the protection flags that are public. By default, everything on PluralBuddy is private.

| Public Flag     | Value                   | Description |
|-----------------|-------------------------|-------------|
| VISIBILITY      | \`1\` \`(1 << 0)\`      | Allows external users to see the alter. |
| NAME            | \`2\` \`(1 << 1)\`      | Allows external users to see the alter's name. |
| DESCRIPTION     | \`4\` \`(1 << 2)\`      | Allows external users to see the alter's description. |
| BANNER          | \`8\` \`(1 << 3)\`      | Allows external users to see the alter's banner. |
| PRONOUNS        | \`16\` \`(1 << 4)\`     | Allows external users to see the alter's pronouns. |
| AVATAR          | \`32\` \`(1 << 5)\`     | Allows external users to see the alter's avatar. |
| TAGS            | \`128\` \`(1 << 7)\`    | Allows external users to see the alter's associated tags. |
| MESSAGE_COUNT   | \`256\` \`(1 << 8)\`    | Allows external users to see the alter's message count. |
| USERNAME        | \`512\` \`(1 << 9)\`    | Allows external users to see the alter's username. |`;


export enum AlterProtectionFlags {
    VISIBILITY     = 1 << 0,
    NAME           = 1 << 1,
    DESCRIPTION    = 1 << 2,
    BANNER         = 1 << 3,
    PRONOUNS       = 1 << 4,
    AVATAR         = 1 << 5,
    TAGS           = 1 << 7,
    MESSAGE_COUNT  = 1 << 8,
    USERNAME       = 1 << 9
}

export const PAlterObject = z.object({
    alterId: z.number(),
    systemId: z.string(),

    username: z.string().max(100).regex(/^[^\s@\\/]+$/),
    displayName: z.string().max(100),
    nameMap: z.object({ server: z.string().max(20), name: z.string().max(100) }).array(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i).nullable(),
    description: z.string().max(1000).nullable(),
    created: z.coerce.date(),
    pronouns: z.string().max(100).nullable(),

    avatarUrl: z.string().nullable(),
    avatarUrlMap: z.record(z.string(), z.string().optional()).default({}),
    webhookAvatarUrl: z.string().nullable(),
    banner: z.string().nullable(),

    lastMessageTimestamp: z.coerce.date().nullable(),
    messageCount: z.number(),
    alterMode: z.enum([ "nickname", "webhook", "both" ]).default("webhook"),
    proxyTags: z.object({ prefix: z.string().max(100), suffix: z.string().max(100), id: z.string() }).array().default([]),

    tagIds: z.string().array().default([]),
    public: z.number().nonnegative().meta({ description: publicDescription })
}).meta({ id: "PAlter" })

export type PAlter = z.infer<typeof PAlterObject>
