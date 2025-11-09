/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { guildCollection } from "../mongodb";

export const PGuildObject = z.object({
    guildId: z.string(),

    /** command prefixes */
    prefixes: z.string().array().default([ "pb!", "pb;" ]),

    /** users allowed to use, channels allowed to proxy */
    blacklistedRoles: z.string().array().default([]),
    blacklistedChannels: z.string().array().default([]),

    nicknameEnforceMode: z.enum([ "whitelist", "blacklist", "both" ]).default("both"),
    whitelistedNicknameRoles: z.string().array().default([]),
    blacklistedNicknameRoles: z.string().array().default([]),

    managerRoles: z.string().array().default([]),
    allowedAlterModes: z.enum([ "webhook", "nickname", "both" ]).default("both"),
    usersRequiredSystemTag: z.boolean().default(false),

    roleMessageTags: z.object({
        roleId: z.string(),
        containerContents: z.string()
    }).array().default([]),

    automod: z.object({
        enabled: z.boolean(),
        rules: z.string().array(),
        appliedOnce: z.enum([ "sent-message", "user-joins-server", "both" ])
            .optional()
    }).default({
        enabled: false,
        rules: [],
        appliedOnce: "both"
    })
})


export type PGuild = z.infer<typeof PGuildObject>

const defaultGuildStructure = (guildId: string) => {
    return PGuildObject.parse({ guildId })
}

export async function getGuildFromId(id: string): Promise<PGuild> {
    return await guildCollection.findOne({ id }) ?? defaultGuildStructure(id);
}