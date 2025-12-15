/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { NudgePreferences } from "@/views/nudge-preferences";

export default class DisableNudgingButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.ToggleNudge.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		let user = await ctx.retrievePUser();

		await writeUserById(user.userId, {
			...user,
			nudging: { ...user.nudging, currentlyEnabled: !user.nudging.currentlyEnabled },
		});

		user.nudging.currentlyEnabled = !user.nudging.currentlyEnabled;

		return await ctx.update({
			components: new NudgePreferences(ctx.userTranslations()).nudgePreferences(user),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
