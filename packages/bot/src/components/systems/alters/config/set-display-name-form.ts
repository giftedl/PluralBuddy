/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";

export default class SetUsernameButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDisplayNameForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDisplayNameForm.substring(
				ctx.customId,
			)[0];

		const systemId = ctx.author.id;
		const query = alterCollection.findOne({
			alterId: Number(alterId),
			systemId,
		});
		let alter = await query;

		if (alter === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const newAlterUsername = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterDisplayNameType.create(),
			true,
		);

		await alterCollection.updateOne(
			{ alterId: Number(alterId), systemId },
			{
				$set: {
					displayName: newAlterUsername as string,
				},
			},
		);

		alter =
			(await alterCollection.findOne({
				alterId: Number(alterId),
				systemId,
			})) ?? alter;

		return await ctx.interaction.update({
			components: [
				...new AlterView(ctx.userTranslations()).alterTopView(
					"public-settings",
					alter.alterId.toString(),
					alter.username,
				),
				...new AlterView(ctx.userTranslations()).altersPublicView(
					alter,
					(await ctx.guild()) ?? { name: "", id: "" },
					await ctx.getDefaultPrefix() ?? "pb;",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
