/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { DiscordSnowflake } from "@sapphire/snowflake";
import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { writeBack } from "@/lib/pk-sync-engine";
import { w } from "@/webhooks";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";

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
				components: new AlertView(await context.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (!(proxyTag.includes("text") || proxyTag.includes("Text"))) {
			context.client.logger.info("Stage 1 (create-pt): {proxyTag}", {
				proxyTag,
			});
			return await context.write({
				components: new AlertView(await context.userTranslations()).errorView(
					"CREATING_NEW_PT_ERROR",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		// Get the prefix and suffix based on "text" position
		const textIndex =
			proxyTag.indexOf("text") === -1
				? proxyTag.indexOf("Text")
				: proxyTag.indexOf("text");
		const prefix = (proxyTag as string).substring(0, textIndex);
		const suffix = (proxyTag as string).substring(textIndex + 4);

		if (prefix.length > 20 || suffix.length > 20) {
			return await context.write({
				components: new AlertView(await context.userTranslations()).errorView(
					"CREATING_NEW_PT_TOO_MANY_CHARS",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (prefix === "" && suffix === "") {
			context.client.logger.info("Stage 2 (create-pt): {proxyTag}", {
				proxyTag,
			});
			return await context.write({
				components: new AlertView(await context.userTranslations()).errorView(
					"CREATING_NEW_PT_ERROR",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const id = DiscordSnowflake.generate();

		await alterCollection.updateOne(
			{ alterId: Number(alterId), systemId },
			{
				$push: {
					proxyTags: {
						prefix,
						suffix,
						id: String(id),
					},
				},
			},
		);

		w(context.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				proxyTags: [
					...alter.proxyTags,
					{
						prefix,
						suffix,
						id: String(id),
					},
				],
			},
		});

		if ((alter.fields ?? {})["@/converter/pk"] !== undefined)
			writeBack({
				type: "alter",
				id: alter.fields["@/converter/pk"] ?? "??",
				change: {
					proxyTags: [
						...alter.proxyTags,
						{
							prefix,
							suffix,
							id: String(id),
						},
					],
				},
				syncConfig: (await context.retrievePUser()).syncConfiguration,
			});

		alter =
			(await alterCollection.findOne({
				alterId: Number(alterId),
				systemId,
			})) ?? alter;

		if (alterId) context.client.cache.alterProxy.remove(alterId);

		return await context.interaction.update({
			components: [
				...new AlterView(await context.userTranslations()).alterTopView(
					"proxy-tags",
					alter.alterId.toString(),
					alter.username,
				),
				...new AlterView(await context.userTranslations()).alterProxyTagsView(
					alter,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
