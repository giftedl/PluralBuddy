/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from 'seyfert';
import { InteractionIdentifier } from '../../../lib/interaction-ids';
import { PluralBuddyIntro } from '../../../views/pluralbuddy-intro';
import { MessageFlags } from 'seyfert/lib/types';
import { createdSystems } from '../create-new-system';
import { combine } from '../../../lib/privacy-bitmask';
import { SystemProtectionFlags } from '../../../types/system';
 
export default class NameInteractionFormCNS extends ModalCommand {
  override filter(context: ModalContext) {
    return InteractionIdentifier.Setup.FormSelection.PrivacyForm.startsWith(context.customId);
  }
 
  async run(ctx: ModalContext) {
    const rootInteractionId = InteractionIdentifier.Setup.FormSelection.PrivacyForm.substring(ctx.customId)[0] ?? "";
    const temporarySystem = createdSystems.get(rootInteractionId);

    if (temporarySystem === undefined) {
        return ctx.write({ content: ctx.userTranslations().ERROR_INTERACTION_TOO_OLD, flags: MessageFlags.Ephemeral })
    }

    const privacyValues = ctx.interaction.getInputValue(InteractionIdentifier.Setup.FormSelection.PrivacyType.create(), false) as string[] | undefined;

    if (privacyValues === undefined) {
        return ctx.interaction.update({
            components: new PluralBuddyIntro(ctx.userTranslations())
                .createNewSystemPage(await ctx.retrievePGuild(), rootInteractionId, ctx.author.id),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
        });
    }
    
    let privacyFlag = 0;
    privacyFlag = combine(...(
        privacyValues.map((val) => {
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_NAME.create()) {
                return SystemProtectionFlags.NAME;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_ALTERS.create()) {
                return SystemProtectionFlags.ALTERS;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_AVATAR.create()) {
                return SystemProtectionFlags.AVATAR;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_DESCRIPTION.create()) {
                return SystemProtectionFlags.DESCRIPTION;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_PRONOUNS.create()) {
                return SystemProtectionFlags.PRONOUNS;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_DISPLAY_TAG.create()) {
                return SystemProtectionFlags.DISPLAY_TAG;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_TAGS.create()) {
                return SystemProtectionFlags.TAGS;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_BANNER.create()) {
                return SystemProtectionFlags.BANNER;
            }

            return SystemProtectionFlags.ALTERS;
        })
    ))

    temporarySystem.public = privacyFlag;
    createdSystems.set(rootInteractionId, temporarySystem)
    
    return ctx.interaction.update({
        components: new PluralBuddyIntro(ctx.userTranslations())
          .createNewSystemPage(await ctx.retrievePGuild(), rootInteractionId, ctx.author.id),
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }
} 