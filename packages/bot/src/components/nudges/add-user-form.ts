<<<<<<< HEAD
/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, ModalCommand, type ModalContext, type ComponentContext } from "seyfert";
=======
/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */
import {
	ComponentCommand,
	ModalCommand,
	type ModalContext,
	type ComponentContext,
} from "seyfert";
>>>>>>> 2bc1cfa15f9539ae844af4a92ea7b0715d42df63
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { defaultUserStructure, writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { NudgePreferences } from "@/views/nudge-preferences";

export default class AddUserForm extends ModalCommand {
  componentType = "Button" as const;

  override filter(context: ModalContext) {
    return InteractionIdentifier.Nudge.AddNudgeForm.startsWith(context.customId);
  }

  override async run(ctx: ModalContext) {
    const userId = ctx.interaction.getInputValue(
      InteractionIdentifier.Nudge.AddNudgeType.create(),
      true,
    )[0];
    const user = await ctx.retrievePUser();

    if (user.nudging.blockedUsers.includes(userId as string)) {
      return await ctx.write({
        components: new AlertView(await ctx.userTranslations()).errorView("USER_ALREADY_BLOCKED"),
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
      });
    }

    await writeUserById(user.userId, {
      ...user,
      nudging: {
        ...user.nudging,
        blockedUsers: [...user.nudging.blockedUsers, userId as string],
      },
    });

    user.nudging = {
      ...user.nudging,
      blockedUsers: [...user.nudging.blockedUsers, userId as string],
    };

    return await ctx.interaction.update({
      components: new NudgePreferences(await ctx.userTranslations()).nudgePreferences(user),
      flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
  }
}
