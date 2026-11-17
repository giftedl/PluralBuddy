/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */
import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { writePersonalSettingsById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { NudgePreferences } from "@/views/nudge-preferences";

export default class AddUserForm extends ModalCommand {
	componentType = "Button" as const;

	override filter(context: ModalContext) {
		return InteractionIdentifier.Nudge.RemoveNudgeForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const userId = ctx.interaction.getInputValue(
			InteractionIdentifier.Nudge.RemoveNudgeType.create(),
			true,
		)[0];
		const user = await ctx.retrievePUser();

		if (!user.nudging.blockedUsers.includes(userId as string)) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"USER_NOT_BLOCKED",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const newBlockedUsers = user.nudging.blockedUsers.filter(
			(id: string) => id !== userId,
		);
		await writePersonalSettingsById(ctx.author.id, {
			...user,
			nudging: { ...user.nudging, blockedUsers: newBlockedUsers },
		});

		user.nudging = { ...user.nudging, blockedUsers: newBlockedUsers };

		return await ctx.interaction.update({
			components: new NudgePreferences(
				await ctx.userTranslations(),
			).nudgePreferences(user),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
