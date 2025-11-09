/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { alterCollection } from "../../../mongodb";
import { AlertView } from "../../../views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { AlterView } from "../../../views/alters";

export default class CreateProxyTagModal extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.ProxyForm.startsWith(
			context.customId,
		);
	}

	override async run(context: ModalContext) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.FormSelection.ProxyForm.substring(
				context.customId,
			)[0];
		const proxyTag = context.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.ProxyType.create(),
			true,
		);

		const systemId = context.author.id;
		const query = alterCollection.findOne({
			alterId: Number(alterId),
			systemId,
		});
		let alter = await query;

		if (alter === null) {
			return await context.write({
				components: new AlertView(context.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (!proxyTag.includes("text")) {
			return await context.write({
				components: new AlertView(context.userTranslations()).errorView(
					"CREATING_NEW_PT_ERROR",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		// Get the prefix and suffix based on "text" position
		const textIndex = proxyTag.indexOf("text");
		const prefix = (proxyTag as string).substring(0, textIndex);
		const suffix = (proxyTag as string).substring(textIndex + 4);

		if (prefix.length > 20 || suffix.length > 20) {
			return await context.write({
				components: new AlertView(context.userTranslations()).errorView(
					"CREATING_NEW_PT_TOO_MANY_CHARS",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (prefix === "" && suffix === "") {
			return await context.write({
				components: new AlertView(context.userTranslations()).errorView(
					"CREATING_NEW_PT_ERROR",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await alterCollection.updateOne(
			{ alterId: Number(alterId), systemId },
			{
				$push: {
					proxyTags: {
						prefix,
						suffix,
						id: String(DiscordSnowflake.generate()),
					},
				},
			},
		);

		alter = await alterCollection.findOne({
			alterId: Number(alterId),
			systemId,
		}) ?? alter;

		return await context.interaction.update({
			components: [
				...new AlterView(context.userTranslations()).alterTopView(
					"proxy-tags",
					alter.alterId.toString(),
					alter.username,
				),
				...new AlterView(context.userTranslations()).alterProxyTagsView(alter),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
