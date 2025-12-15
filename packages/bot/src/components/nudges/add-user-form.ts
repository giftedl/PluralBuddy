/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, ModalCommand, ModalContext, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { defaultUserStructure, writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { NudgePreferences } from "@/views/nudge-preferences";

export default class AddUserForm extends ModalCommand {
	componentType = "Button" as const;

	override filter(context: ModalContext) {
		return InteractionIdentifier.Nudge.AddNudgeForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
        const userId = ctx.interaction.getInputValue(InteractionIdentifier.Nudge.AddNudgeType.create(), true)[0];
        const user = await ctx.retrievePUser();

        if (user.nudging.blockedUsers.includes(userId as string)) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("USER_ALREADY_BLOCKED"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

		await writeUserById(user.userId, {
			...user,
			nudging: { ...user.nudging, blockedUsers: [...user.nudging.blockedUsers, userId as string] },
		});

        user.nudging = { ...user.nudging, blockedUsers: [...user.nudging.blockedUsers, userId as string] };

        return await ctx.interaction.update({
			components: new NudgePreferences(ctx.userTranslations()).nudgePreferences(user),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
    }
}
