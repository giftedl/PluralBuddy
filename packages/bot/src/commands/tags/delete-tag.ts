import {
    ActionRow,
	Button,
	CommandContext,
	createStringOption,
	Declare,
	Options,
	SubCommand,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { emoji } from "zod";
import { autocompleteTags } from "@/lib/autocomplete-tags";
import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { tagCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

const options = {
	"tag-name": createStringOption({
		description: "The name of the tag to delete.",
		required: true,
		autocomplete: autocompleteTags,
	}),
};

@Declare({
	name: "delete",
	description: "Delete a tag",
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class EditTagDisplayNameCommand extends SubCommand {
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
			return await ctx.ephemeral(
				{
					components: new AlertView(await ctx.userTranslations()).errorView(
						"ERROR_TAG_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		if (tag.associatedAlters.length > 5) {
			return await ctx.ephemeral({
				components: [
					...new AlertView(await ctx.userTranslations()).questionViewCustom(
						(await ctx.userTranslations()).WARN_DELETE_TAG.replace(
							"{{ tag }}",
							tag.tagFriendlyName,
						),
					),
					new ActionRow().setComponents(
						new Button()
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Tags.AssureDeleteTag.create(
									tag.tagId,
								),
							)
							.setLabel((await ctx.userTranslations()).ACKNOWLEDGE_DELETE_TAG)
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji(emojis.xWhite),
					),
				],
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
			}, undefined, undefined, ctx);
		}

		await tagCollection.deleteOne({ tagId: tag.tagId });
        await userCollection.updateOne({ userId: ctx.author.id }, { $pull: { "system.tagIds": tag.tagId }})

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).SUCCESSFULLY_DELETED_TAG.replace(
						"{{ tag }}",
						tag.tagFriendlyName,
					),
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
