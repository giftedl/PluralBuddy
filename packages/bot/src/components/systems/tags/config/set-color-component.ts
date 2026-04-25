import { ActionRow, ComponentCommand, Container, StringSelectMenu, TextDisplay, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { tagCollection } from "@/mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";
import { TagView } from "@/views/tags";
import { tagColorSelection } from "@/lib/selection-options";
import { emojis, getEmojiFromTagColor } from "@/lib/emojis";
import { tagColors, tagHexColors } from "@/types/tag";
import { w } from "@/webhooks";

export default class SetColorComponent extends ComponentCommand {
	componentType = "StringSelect" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorComponent.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.deferUpdate();
		const tagId =
            InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorComponent.substring(
                    ctx.customId,
                )[0];

		const systemId = ctx.author.id;
		const query = tagCollection.findOne({
			tagId,
			systemId,
		});
		let tag = await query;

		if (tag === null) {
			return await ctx.followup({
				components: new AlertView((await ctx.userTranslations())).errorView(
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
		
		w(ctx.author.id, "tag.update", {
			type: "tag.update",
			tag: {
				...tag,
				tagColor: newTagColor
			},
		});

		tag =
			(await tagCollection.findOne({
				tagId,
				systemId,
			})) ?? tag;

		return await ctx.interaction.editResponse({
			components: [
				new Container()
					.setComponents(
						new TextDisplay().setContent(`## ${emojis.wrenchWhite} Set Tag Color for ${tag.tagFriendlyName}
The current tag color for ${tag.tagFriendlyName} is   ${getEmojiFromTagColor(tag.tagColor)}  **${tag.tagColor}**. You can set the tag color below.`),
						new ActionRow().setComponents(
							new StringSelectMenu()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagColorComponent.create(tag.tagId),
								)
								.setOptions(
									tagColorSelection((await ctx.userTranslations()), tag.tagColor),
								),
						),
					)
					.setColor(`#${tagHexColors[tagColors.indexOf(tag.tagColor)]}`),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
