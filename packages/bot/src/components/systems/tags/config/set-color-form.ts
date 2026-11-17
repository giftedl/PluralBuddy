/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { tagCollection } from "@/mongodb";
import { TagView } from "@/views/tags";
import { w } from "@/webhooks";
import {writeBack} from "@/lib/pk-sync-engine.ts";

export default class SetUsernameButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const tagId =
			InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorForm.substring(
				ctx.customId,
			)[0];

		const systemId = await ctx.systemId();
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

		const newTagColor = ctx.interaction
			.getInputValue(
				InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorType.create(),
				true,
			)[0]
			?.substring("selection/tag-color/".length);

		await tagCollection.updateOne(
			{ tagId, systemId },
			{
				$set: {
					tagColor: newTagColor as string,
				},
			},
		);

		w(ctx.author.id, "tag.update", {
			type: "tag.update",
			tag: {
				...tag,
				tagColor: newTagColor,
			},
		});

        if (tag.fields["@/converter/pk"])
            writeBack({
                type: "tag",
                id: tag.fields["@/converter/pk"],
                change: {
                    tagColor: newTagColor,
                },
                syncConfig: (await ctx.retrievePUser()).syncConfiguration,
            });

		tag =
			(await tagCollection.findOne({
				tagId,
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
