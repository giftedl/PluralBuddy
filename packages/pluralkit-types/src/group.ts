/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PrivacyLevel } from "./privacy";

export const PluralKitGroup = z.object({

    "id": z.string(),
    "uuid": z.string(),
    "name": z.string(),
    "display_name": z.string().nullable(),
    "description": z.string().nullable(),
    "icon": z.string().nullable(),
    "banner": z.string().nullable(),
    "color": z.string().nullable(),
    "created": z.coerce.date(),
    "members": z.string().array(),
    "privacy": z.object({
        "name_privacy":        PrivacyLevel,
        "description_privacy": PrivacyLevel,
        "banner_privacy":      PrivacyLevel,
        "icon_privacy":        PrivacyLevel,
        "list_privacy":        PrivacyLevel,
        "metadata_privacy":    PrivacyLevel,
        "visibility":          PrivacyLevel
    }),
})