/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PrivacyLevel } from "./privacy";

export const PluralKitMember = z.object({
    id: z.string(),
    uuid: z.string(),
    name: z.string(),
    "display_name": z.string().nullable(),
    color: z.string().nullable(),
    birthday: z.string().nullable(),
    "avatar_url": z.string().nullable(),
    "webhook_avatar_url": z.string().nullable(),
    pronouns: z.string().nullable(),
    banner: z.string().nullable(),
    description: z.string().nullable(),
    created: z.coerce.date(),
    "keep_proxy": z.boolean(),
    "tts": z.boolean(),
    "autoproxy_enabled": z.boolean(),
    "message_count": z.number(),
    "last_message_timestamp": z.coerce.date().nullable(),
    "proxy_tags": z.object({
        prefix: z.string().nullable(),
        suffix: z.string().nullable()
    }).array(),
    "privacy": z.object({
        "visibility":          PrivacyLevel,
        "name_privacy":        PrivacyLevel,
        "description_privacy": PrivacyLevel,
        "banner_privacy":      PrivacyLevel,
        "birthday_privacy":    PrivacyLevel,
        "pronoun_privacy":     PrivacyLevel,
        "avatar_privacy":      PrivacyLevel,
        "metadata_privacy":    PrivacyLevel,
        "proxy_privacy":       PrivacyLevel
    })
})