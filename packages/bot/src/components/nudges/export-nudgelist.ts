import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { AttachmentBuilder } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

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
			files: [
				new AttachmentBuilder()
					.setName("nudge-block-list.json")
					.setFile(
						"buffer",
						Buffer.from(JSON.stringify(user.nudging.blockedUsers)),
					),
			],
            flags: MessageFlags.Ephemeral
        })
    }
}
