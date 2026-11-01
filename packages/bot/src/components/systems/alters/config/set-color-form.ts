/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";
import { w } from "@/webhooks";
import { writeBack } from "@/lib/pk-sync-engine.ts";

export default class SetUsernameButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterColorForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterColorForm.substring(
				ctx.customId,
			)[0];

		const systemId = await ctx.systemId();
		const query = alterCollection.findOne({
			alterId: Number(alterId),
			systemId,
		});
		let alter = await query;

		if (alter === null) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const newAlterColor = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterColorType.create(),
			true,
		) as string;

		if (!/^#[0-9A-F]{6}$/i.test(newAlterColor)) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_INVALID_COLOR",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await alterCollection.updateOne(
			{ alterId: Number(alterId), systemId },
			{
				$set: {
					color: newAlterColor as string,
				},
			},
		);

		w(ctx.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				color: newAlterColor as string,
			},
		});

		if (alter.fields["@/converter/pk"])
			writeBack({
				type: "alter",
				id: alter.fields["@/converter/pk"],
				change: {
					color: newAlterColor as string,
				},
				syncConfig: (await ctx.retrievePUser()).syncConfiguration,
			});

		alter =
			(await alterCollection.findOne({
				alterId: Number(alterId),
				systemId,
			})) ?? alter;

		return await ctx.interaction.update({
			components: [
				...new AlterView(await ctx.userTranslations()).alterTopView(
					"public-settings",
					alter.alterId.toString(),
					alter.username,
				),
				...new AlterView(await ctx.userTranslations()).altersPublicView(
					alter,
					(await ctx.guild()) ?? { name: "", id: "" },
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
