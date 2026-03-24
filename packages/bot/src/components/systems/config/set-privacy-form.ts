/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { createSystemOperation } from "../../../lib/system-operation";
import { SystemProtectionFlags, type PSystem } from "../../../types/system";
import { SystemSettingsView } from "../../../views/system-settings";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "../../../views/alert";
import { combine } from "../../../lib/privacy-bitmask";

export default class SetNameForm extends ModalCommand {

  override filter(context: ModalContext) {
    return InteractionIdentifier.Systems.Configuration.FormSelection.PrivacyForm.startsWith(context.customId);
  }

  async run(ctx: ModalContext) {
    const user = await ctx.retrievePUser()

    if (user.system === undefined) {
      return await ctx.interaction.update({
          components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
          flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
      })
    }

    const privacyValues = ctx.interaction.getInputValue(InteractionIdentifier.Setup.FormSelection.PrivacyType.create(), false) as string[] | undefined;

    if (privacyValues === undefined)
        return;

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

    const updatedSystem = await createSystemOperation(user.system, {
      public: privacyFlag
    }, ctx.userTranslations(), "discord")

    if (updatedSystem === undefined) {
      return await ctx.interaction.update({
          components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
          flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
      })
    }

    await ctx.interaction.update({
      components: [
          ...new SystemSettingsView(ctx.userTranslations()).topView("general", updatedSystem.associatedUserId),
          ...new SystemSettingsView(ctx.userTranslations()).generalSettings(updatedSystem, ctx.guildId)

      ],
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral

  })
  }
}