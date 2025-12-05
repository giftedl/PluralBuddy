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
	"tag-description": createStringOption({
		description: "The new description for the tag.",
		max_length: 2000,
	}),
};

@Declare({
	name: "description",
	description: "Edit the description of a tag",
	aliases: ["desc", "d"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class EditTagDisplayNameCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "tag-name": tagName, "tag-description": tagDescription } =
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

		if (tagDescription === undefined) {
			return await ctx.ephemeral(
				{
					components: [
						new Container().setComponents(
							new TextDisplay().setContent(`\`\`\`
${tag.tagDescription ?? "⛔ Your tag has no description."}
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
			{ $set: { tagDescription } },
		);

		return await ctx.write({
			components: [
				...new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations()
						.ALTER_SUCCESS_DESC.replace("%alter%", tag.tagFriendlyName),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
