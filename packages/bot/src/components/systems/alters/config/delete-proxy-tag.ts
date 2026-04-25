/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../../lib/interaction-ids";
import { alterCollection } from "../../../../mongodb";
import { AlertView } from "../../../../views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { AlterView } from "../../../../views/alters";
import { w } from "@/webhooks";

export default class DeleteProxyTag extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Alters.DeleteProxyTag.startsWith(
			context.customId,
		);
	}

	override async run(context: ComponentContext<typeof this.componentType>) {
		const alterId =
			InteractionIdentifier.Systems.Configuration.Alters.DeleteProxyTag.substring(
				context.customId,
			)[0];
		const proxyTag =
			InteractionIdentifier.Systems.Configuration.Alters.DeleteProxyTag.substring(
				context.customId,
			)[1];

		const systemId = context.author.id;
		const query = alterCollection.findOne({
			$and: [{ alterId: Number(alterId) }, { systemId }],
		});
		let alter = await query;

		if (
			alter === null ||
			alter.proxyTags.filter((v) => v.id === proxyTag).length !== 1
		) {
			return await context.write({
				components: new AlertView(await context.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await alterCollection.updateOne(
			{ alterId: Number(alterId), systemId },
			{
				$pull: {
					proxyTags: { id: proxyTag },
				},
			},
		);

		w(context.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				proxyTags: [
					...alter.proxyTags.filter(v => v.id !== proxyTag),
				],
			},
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
				...new AlterView(await context.userTranslations()).alterProxyTagsView(alter),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
