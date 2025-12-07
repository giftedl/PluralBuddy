/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { SubCommand } from "seyfert";
import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	type CommandContext,
	Container,
	createBooleanOption,
	createStringOption,
	Declare,
	Options,
	TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { autocompleteTags } from "@/lib/autocomplete-tags";

const options = {
	"tag-name": createStringOption({
		description: "The name of the tag to modify.",
		required: true,
		autocomplete: autocompleteTags,
	}),
	"tag-display-name": createStringOption({
		description: "The new display name for the tag.",
		max_length: 2000,
	}),
};

@Declare({
	name: "rename",
	description: "Edit the display name of a tag",
	aliases: ["rn", "r"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class EditTagDisplayNameCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "tag-name": tagName, "tag-display-name": tagFriendlyName } =
			ctx.options;

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

		if (tagFriendlyName === undefined) {
			return await ctx.ephemeral(
				{
					components: [
						new Container().setComponents(
							new TextDisplay().setContent(`\`\`\`
${tag.tagFriendlyName ?? "⛔ Your tag has no display name."}
\`\`\``),
						),
					],
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				},
				true,
			);
		}

		await tagCollection.updateOne(
			{ tagId: tag.tagId },
			{ $set: { tagFriendlyName } },
		);

		return await ctx.write({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations()
						.TAG_RENAME_SUCCESS.replace("%tag%", tag.tagFriendlyName),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
