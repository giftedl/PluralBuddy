/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { StringSelectOption } from "seyfert";
import type { TranslationString } from "../lang";
import { InteractionIdentifier } from "./interaction-ids";
import { has } from "./privacy-bitmask";
import { SystemProtectionFlags } from "../types/system";

export const privacySelection = (translations: TranslationString, existing?: number) => [
    new StringSelectOption()
        .setLabel(translations.PRIVACY_NAME)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_NAME.create())
        .setDefault(has(SystemProtectionFlags.NAME, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_DISPLAY_TAG)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_DISPLAY_TAG.create())
        .setDefault(has(SystemProtectionFlags.DISPLAY_TAG, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_DESCRIPTION)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_DESCRIPTION.create())
        .setDefault(has(SystemProtectionFlags.DESCRIPTION, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_AVATAR)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_AVATAR.create())
        .setDefault(has(SystemProtectionFlags.AVATAR, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_BANNER)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_BANNER.create())
        .setDefault(has(SystemProtectionFlags.BANNER, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_PRONOUNS)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_PRONOUNS.create())
        .setDefault(has(SystemProtectionFlags.PRONOUNS, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_ALTERS)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_ALTERS.create())
        .setDefault(has(SystemProtectionFlags.ALTERS, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_TAGS)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_TAGS.create())
        .setDefault(has(SystemProtectionFlags.TAGS, existing)),
]