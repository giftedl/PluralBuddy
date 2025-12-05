import { autocompleteTags } from "@/lib/autocomplete-tags";
import { emojis, getEmojiFromTagColor } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { tagColorSelection } from "@/lib/selection-options";
import { tagCollection } from "@/mongodb";
import { tagColors, tagHexColors } from "@/types/tag";
import { AlertView } from "@/views/alert";
import {
	type CommandContext,
	createStringOption,
	Declare,
	SubCommand,
	Options,
	Container,
	TextDisplay,
	ActionRow,
	StringSelectMenu,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"tag-name": createStringOption({
		description: "The name of the tag to modify.",
		required: true,
		autocomplete: autocompleteTags,
	}),
};

@Declare({
	name: "color",
	description: "Set color of tag.",
	aliases: ["c", "clr"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class TagColorCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "tag-name": tagName } = ctx.options;

		const systemId = ctx.author.id;
		const query = Number.isNaN(Number.parseInt(tagName))
			? tagCollection.findOne({ $or: [{ tagFriendlyName: tagName }], systemId })
			: tagCollection.findOne({
					$or: [{ tagFriendlyName: tagName }, { tagId: tagName }],
					systemId,
				});
		const tag = await query;

		if (tag === null) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_TAG_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.ephemeral({
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
