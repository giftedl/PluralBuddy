/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
	type CommandContext,
	Container,
	createBooleanOption,
	createStringOption,
	Declare,
	Options,
	SubCommand,
	TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { autocompleteTags } from "@/lib/autocomplete-tags";
import { writeBack } from "@/lib/pk-sync-engine";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { w } from "@/webhooks";

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
		await ctx.deferReply(true);
		const { "tag-name": tagName, "tag-description": tagDescription } =
			ctx.options;

		const systemId = await ctx.systemId();
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
				undefined,
				ctx,
			);
		}

		await tagCollection.updateOne(
			{ tagId: tag.tagId },
			{ $set: { tagDescription } },
		);

		w(ctx.author.id, "tag.update", {
			type: "tag.update",
			tag: {
				...tag,
				tagDescription,
			},
		});

		if (tag.fields["@/converter/pk"])
			writeBack({
				type: "tag",
				id: tag.fields["@/converter/pk"],
				change: {
					tagDescription,
				},
				syncConfig: (await ctx.retrievePUser()).syncConfiguration,
			});

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).ALTER_SUCCESS_DESC.replace(
						"%alter%",
						tag.tagFriendlyName,
					),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
