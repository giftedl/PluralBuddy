/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";

export default class DisableNudgingButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.Snooze.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		let user = await ctx.retrievePUser();

		// Database migration (12/04/25)
		if (user.nudging === undefined) {
			await userCollection.updateOne(
				{ userId: user.userId },
				{ $set: { nudging: { blockedUsers: [], currentlyEnabled: true } } },
			);

			// Set user in memory
			user.nudging = { blockedUsers: [], currentlyEnabled: true };
		}
		// End database migration

		await writeUserById(user.userId, {
			...user,
			nudging: { ...user.nudging, currentlyEnabled: false },
		});

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successView("DISABLE_NUDGING_DONE"),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
