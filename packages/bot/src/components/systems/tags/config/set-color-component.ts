import { ActionRow, ComponentCommand, Container, StringSelectMenu, TextDisplay, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { tagCollection } from "@/mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";
import { TagView } from "@/views/tags";
import { tagColorSelection } from "@/lib/selection-options";
import { emojis, getEmojiFromTagColor } from "@/lib/emojis";
import { tagColors, tagHexColors } from "@/types/tag";

export default class SetColorComponent extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorType.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
        console.log("ran")
		const tagId =
            InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorType.substring(
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

		const newTagColor = (ctx.interaction.values[0] as string).substring("selection/tag-color/".length);

		await tagCollection.updateOne(
			{ tagId, systemId },
			{
				$set: {
					tagColor: newTagColor as string,
				},
			},
		);

		tag =
			(await tagCollection.findOne({
				tagId,
				systemId,
			})) ?? tag;

		return await ctx.interaction.update({
			components: [
				new Container()
					.setComponents(
						new TextDisplay().setContent(`## ${emojis.wrenchWhite} Set Tag Color for ${tag.tagFriendlyName}
The current tag color for ${tag.tagFriendlyName} is   ${getEmojiFromTagColor(tag.tagColor)}  **${tag.tagColor}**. You can set the tag color below.`),
						new ActionRow().setComponents(
							new StringSelectMenu()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorType.create(tag.tagId),
								)
								.setOptions(
									tagColorSelection(ctx.userTranslations(), tag.tagColor),
								),
						),
					)
					.setColor(`#${tagHexColors[tagColors.indexOf(tag.tagColor)]}`),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
