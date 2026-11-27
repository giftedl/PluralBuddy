/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { writePersonalSettingsById } from "@/types/user";
import { AlertView } from "@/views/alert";

export default class AddUserForm extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.BlockUser.startsWith(context.customId);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const userId = InteractionIdentifier.Nudge.BlockUser.substring(
			ctx.customId,
		)[0];
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

		if (user.nudging.blockedUsers.includes(userId as string)) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"USER_ALREADY_BLOCKED",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		await writePersonalSettingsById(ctx.author.id, {
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

		return await ctx.write({
			components: new AlertView(await ctx.userTranslations()).successView(
				"SUCCESSFULLY_BLOCKED",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
