import { InteractionIdentifier } from "@/lib/interaction-ids";
import { userCollection } from "@/mongodb";
import { assetStringGeneration, PUserObject, terminologyDefaults } from "plurography";
import {
	ModalCommand,
	type ModalContext,
	type ComponentContext,
} from "seyfert";

export default class AcceptPolicy extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.PolicyForm.startsWith(context.customId ?? "");
	}

	override async run(ctx: ModalContext) {
		await userCollection.updateOne(
			{ userId: ctx.author.id },
			{
				$set: PUserObject.parse({
					userId: ctx.author.id,
					policyStatus: 1,
					terminology: terminologyDefaults
				}),
			},
			{ upsert: true },
		)
		const newCustomId = InteractionIdentifier.PolicyForm.substring(
			ctx.customId ?? "",
		).join("-");

		return ctx.client.components.commands.map(async (c) => {
			if (
				await c.filter?.({
					...ctx,
					customId: newCustomId,
					interaction: { ...ctx.interaction, values: ["", "", "", ""] },
				} as unknown as ModalContext & ComponentContext<never>)
			) {
				console.log("found");
				return await c.run(ctx as ModalContext & ComponentContext<never>);
			}
			return null;
		});
	}
}
