/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { writePersonalSettingsById } from "@/types/user";
import { AlertView } from "@/views/alert";

export default class DisableNudgingButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.Snooze.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const user = await ctx.retrievePUser();

		// Database migration (12/04/25)
		if (user.nudging === undefined) {
			await userCollection.updateOne(
				{ userId: ctx.author.id },
				{
					$set: {
						nudging: {
							blockedUsers: [],
							currentlyEnabled: true,
							dmReply: false,
							serverReplying: false,
						},
					},
				},
			);

			// Set user in memory
			user.nudging = {
				blockedUsers: [],
				currentlyEnabled: true,
				dmReply: false,
				serverReplying: false,
			};
		}
		// End database migration

		await writePersonalSettingsById(ctx.author.id, {
			...user,
			nudging: { ...user.nudging, currentlyEnabled: false },
		});

		return await ctx.write({
			components: new AlertView(await ctx.userTranslations()).successView(
				"DISABLE_NUDGING_DONE",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
