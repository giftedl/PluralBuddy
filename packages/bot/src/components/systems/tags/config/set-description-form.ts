/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";
import { TagView } from "@/views/tags";

export default class SetPronounsButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagDescriptionForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const tagId =
			InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagDescriptionForm.substring(
				ctx.customId,
			)[0];

		const systemId = ctx.author.id;
		const query = tagCollection.findOne({
			tagId,
			systemId,
		});
		let tag = await query;

		if (tag === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_TAG_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const tagDescription = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagDescriptionType.create(),
			true,
		);

		await tagCollection.updateOne(
			{ alterId: Number(tagId), systemId },
			{
				$set: {
					tagDescription: tagDescription as string,
				},
			},
		);

		tag =
			(await tagCollection.findOne({
				alterId: Number(tagId),
				systemId,
			})) ?? tag;

		return await ctx.interaction.update({
			components: [
				...new TagView(ctx.userTranslations()).tagTopView(
					"general",
					tag.tagId.toString(),
					tag.tagFriendlyName,
				),
				...new TagView(ctx.userTranslations()).tagGeneral(tag, await ctx.getDefaultPrefix() ?? "pb;"),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
