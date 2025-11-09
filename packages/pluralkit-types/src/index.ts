/**
 * PluralBuddy Discord Bot
 *  - is licensed under MIT License.
 */

import { z } from "zod";
import { allShortenedTimezones } from "./timezones";
import { PluralKitMember } from "./member";
import { PluralKitGroup } from "./group";
import { PrivacyLevel } from "./privacy";

export { PrivacyLevel } from "./privacy";

export const PluralKitConfiguration = z.object({
    timezone: z.enum(allShortenedTimezones()),
    "pings_enabled": z.boolean(),
    "latch_timeout": z.number().nullable(),
    "member_default_private": z.boolean(),
    "group_default_private": z.boolean(),
    "show_private_info": z.boolean(),
    "member_limit": z.number().nullable().default(1000),
    "group_limit":  z.number().nullable().default(250),
    "case_sensitive_proxy_tags": z.boolean(),
    "proxy_error_message_enabled": z.boolean(),
    "hid_display_split": z.boolean(),
    "hid_display_caps": z.boolean(),
    "hid_list_padding": z.enum([ "off", "left", "right" ]),
    "card_show_color_hex": z.boolean(),
    "proxy_switch": z.enum([ "off", "new", "add" ]),
    "name_format": z.string().nullable(),
    "description_templates": z.array(z.string())
})

export const PluralKitSystem = z.object({
    version: z.number(),
    id: z.string(),
    uuid: z.uuid(),
    created: z.coerce.date(),

    // Display characteristics 
    name: z.string().nullable(),
    description: z.string().nullable(),
    tag: z.string().nullable(),
    "avatar_url": z.string().nullable(),
    pronouns: z.string().nullable(),
    banner: z.string().nullable(),
    color: z.string().nullable(),
    privacy: z.object({
        "name_privacy": PrivacyLevel,
        "avatar_privacy": PrivacyLevel,
        "description_privacy": PrivacyLevel,
        "banner_privacy": PrivacyLevel,
        "pronoun_privacy": PrivacyLevel,
        "member_list_privacy": PrivacyLevel,
        "group_list_privacy": PrivacyLevel,
        "front_privacy": PrivacyLevel,
        "front_history_privacy": PrivacyLevel
    }),

    "webhook_url": z.string().nullable(),
    // "webhook_token": z.string().nullable(),
    config: PluralKitConfiguration,

    accounts: z.number().array(),
    members: PluralKitMember.array(),
    groups: PluralKitGroup.array(),

    switches: z.array(z.object({
        timestamp: z.coerce.date(),
        members: z.string().array(),
    }))
})
