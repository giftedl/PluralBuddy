/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import {writeBack} from "@/lib/pk-sync-engine.ts";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { TagView } from "@/views/tags";
import { w } from "@/webhooks";

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
				components: new AlertView(await ctx.userTranslations()).errorView(
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

		w(ctx.author.id, "tag.update", {
			type: "tag.update",
			tag: {
				...tag,
				tagDescription: tagDescription,
			},
		});



        if (tag.fields["@/converter/pk"])
            writeBack({
                type: "tag",
                id: tag.fields["@/converter/pk"],
                change: {
                    tagDescription: typeof tagDescription === "string" ? tagDescription : tagDescription[0],
                },
                syncConfig: (await ctx.retrievePUser()).syncConfiguration,
            });

		tag =
			(await tagCollection.findOne({
				alterId: Number(tagId),
				systemId,
			})) ?? tag;

		return await ctx.interaction.update({
			components: [
				...new TagView(await ctx.userTranslations()).tagTopView(
					"general",
					tag.tagId.toString(),
					tag.tagFriendlyName,
				),
				...new TagView(await ctx.userTranslations()).tagGeneral(
					tag,
					(await ctx.getDefaultPrefix()) ?? "pb;",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
