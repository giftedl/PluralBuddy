/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { StringSelectOption } from "seyfert";
import type { TranslationString } from "../lang";
import { InteractionIdentifier } from "./interaction-ids";
import { has } from "./privacy-bitmask";
import { SystemProtectionFlags } from "../types/system";
import { tagColors, TagProtectionFlags } from "@/types/tag";
import { getEmojiFromTagColor } from "./emojis";
import { AlterProtectionFlags } from "@/types/alter";

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

export const tagPrivacySelection = (translations: TranslationString, existing?: number) => [
    new StringSelectOption()
        .setLabel(translations.PRIVACY_NAME)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_NAME.create())
        .setDefault(has(TagProtectionFlags.NAME, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_DESCRIPTION)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_DESCRIPTION.create())
        .setDefault(has(TagProtectionFlags.DESCRIPTION, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_COLOR)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_COLOR.create())
        .setDefault(has(TagProtectionFlags.COLOR, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_ALTERS)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_ALTERS.create())
        .setDefault(has(TagProtectionFlags.ALTERS, existing)),

]

export const alterPrivacySelection = (translations: TranslationString, existing?: number) => [
    new StringSelectOption()
        .setLabel(translations.PRIVACY_VISIBILITY)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_VISIBILITY.create())
        .setDefault(has(AlterProtectionFlags.VISIBILITY, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_NAME)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_NAME.create())
        .setDefault(has(AlterProtectionFlags.NAME, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_DESCRIPTION)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_DESCRIPTION.create())
        .setDefault(has(AlterProtectionFlags.DESCRIPTION, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_AVATAR)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_AVATAR.create())
        .setDefault(has(AlterProtectionFlags.AVATAR, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_BANNER)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_BANNER.create())
        .setDefault(has(AlterProtectionFlags.BANNER, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_MESSAGE_COUNT)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_MESSAGE_COUNT.create())
        .setDefault(has(AlterProtectionFlags.MESSAGE_COUNT, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_USERNAME)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_USERNAME.create())
        .setDefault(has(AlterProtectionFlags.USERNAME, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_TAGS)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_TAGS.create())
        .setDefault(has(AlterProtectionFlags.TAGS, existing)),
    new StringSelectOption()
        .setLabel(translations.PRIVACY_PRONOUNS)
        .setValue(InteractionIdentifier.Selection.PrivacyValues.PRIVACY_PRONOUNS.create())
        .setDefault(has(AlterProtectionFlags.PRONOUNS, existing))
]

export const tagColorSelection = (translations: TranslationString, existing?: string) => [
    ...tagColors.map((color) => new StringSelectOption()
        .setLabel(color)
        .setEmoji(getEmojiFromTagColor(color))
        .setValue(InteractionIdentifier.Selection.TagColors[color as keyof typeof InteractionIdentifier.Selection.TagColors].create())
        .setDefault(existing === color))
]