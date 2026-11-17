import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { writePersonalSettingsById } from "@/types/user";
import { NudgePreferences } from "@/views/nudge-preferences";

export default class AddUserBlockListNudge extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.ToggleServerReplies.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		// Update database property to serverReplying
		await writePersonalSettingsById(ctx.author.id, {
			...user,
			nudging: {
				...user.nudging,
				serverReplying: !(user.nudging.serverReplying ?? false),
			},
		});

		// Reflect the state change in the local object variable
		user.nudging.serverReplying = !(user.nudging.serverReplying ?? false);

		return await ctx.update({
			components: new NudgePreferences(
				await ctx.userTranslations(),
			).nudgePreferences(user),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
