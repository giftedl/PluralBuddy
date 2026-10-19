/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import {
	ComponentCommand,
	type ComponentContext,
	ModalCommand,
	ModalContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { defaultUserStructure, writeUserById } from "@/types/user";
import { AlertView } from "@/views/alert";
import { NudgePreferences } from "@/views/nudge-preferences";

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
				{ userId: user.userId },
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

		return await ctx.write({
			components: new AlertView(await ctx.userTranslations()).successView(
				"SUCCESSFULLY_BLOCKED",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
