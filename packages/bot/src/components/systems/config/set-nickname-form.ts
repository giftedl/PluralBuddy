/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { createSystemOperation } from "../../../lib/system-operation";
import type { PSystem } from "../../../types/system";
import { SystemSettingsView } from "../../../views/system-settings";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "../../../views/alert";

export default class SetNameForm extends ModalCommand {

  override filter(context: ModalContext) {
    return InteractionIdentifier.Systems.Configuration.FormSelection.NicknameForm.startsWith(context.customId);
  }

  async run(ctx: ModalContext) {
    const newSystemNick = ctx.interaction.getInputValue(InteractionIdentifier.Systems.Configuration.FormSelection.NicknameType.create(), true)
    const user = await ctx.retrievePUser()

    if (user.system === undefined) {
      return await ctx.interaction.update({
          components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
          flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
      })
    }

    const updatedSystem = await createSystemOperation(user.system, {
      nicknameFormat: newSystemNick as string
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