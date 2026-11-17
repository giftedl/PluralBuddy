/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { writePersonalSettingsById } from "@/types/user";
import { MessageFlags } from "seyfert/lib/types";
import { NudgePreferences } from "@/views/nudge-preferences";

export default class DisableNudgingButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.ToggleNudge.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		await writePersonalSettingsById(ctx.author.id, {
			...user,
			nudging: {
				...user.nudging,
				currentlyEnabled: !user.nudging.currentlyEnabled,
			},
		});

		user.nudging.currentlyEnabled = !user.nudging.currentlyEnabled;

		return await ctx.update({
			components: new NudgePreferences(
				await ctx.userTranslations(),
			).nudgePreferences(user),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
