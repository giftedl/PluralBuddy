import {
	ComponentCommand,
	Container,
	Separator,
	TextDisplay,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { AttachmentBuilder } from "seyfert";
import { MessageFlags, Spacing } from "seyfert/lib/types";

export default class ExportNudgelist extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Nudge.ExportBlockList.startsWith(
			context.customId,
		);
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

		return await ctx.write({
			files:
				user.nudging.blockedUsers.length >= 100
					? [
							new AttachmentBuilder()
								.setName("nudge-block-list.json")
								.setFile(
									"buffer",
									Buffer.from(JSON.stringify(user.nudging.blockedUsers)),
								),
						]
					: [],
			components:
				user.nudging.blockedUsers.length < 100
					? [
							new Container().setComponents(
								new TextDisplay().setContent("## Nudge List"),
								new Separator().setSpacing(Spacing.Large),
								new TextDisplay().setContent(
									`> - ${(
										await Promise.all(
											user.nudging.blockedUsers.map(async (c) => {
												const user = await ctx.client.users
													.fetch(c)
													.catch(() => null);

												return `@${user?.username ?? "unknown-user"} (<@${c}>)`;
											}),
										)
									).join("\n> - ")}`,
								),
							),
						]
					: [],
			allowed_mentions: { parse: [] },
			flags:
				user.nudging.blockedUsers.length >= 400
					? MessageFlags.Ephemeral
					: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
