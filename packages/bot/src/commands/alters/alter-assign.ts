/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { autocompleteTags } from "@/lib/autocomplete-tags";
import { emojis, getEmojiFromTagColor } from "@/lib/emojis";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { w } from "@/webhooks";
import {
	createStringOption,
	Declare,
	SubCommand,
	Options,
	CommandContext,
	TextDisplay,
	Button,
	ActionRow,
} from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";

const options = {
	"alter-name": createStringOption({
		description: "Name of the alter to assign",
		required: true,
		autocomplete: autocompleteAlters,
	}),
	"tag-name": createStringOption({
		description: "Name of tag to assign",
		required: true,
		autocomplete: autocompleteTags,
	}),
};

@Declare({
	name: "assign",
	description: "Assign a tag to an alter",
	contexts: ["Guild", "BotDM"],
	aliases: ["a", "tag", "assign-tag"],
})
@Options(options)
export default class AssignTag extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const { "alter-name": alterName, "tag-name": tagName } = ctx.options;

		const systemId = ctx.author.id;

        const alter = ctx.contextAlter() ?? await (Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId }))


		if (alter === null) {
			return await ctx.ephemeral({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			}, undefined, undefined, ctx);
		}

		const tagQuery = Number.isNaN(Number.parseInt(tagName))
			? tagCollection.findOne({ $or: [{ tagFriendlyName: tagName }], systemId })
			: tagCollection.findOne({
					$or: [{ tagFriendlyName: tagName }, { tagId: tagName }],
					systemId,
				});
		const tag = await tagQuery;

		if (tag === null) {
			return await ctx.ephemeral({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_TAG_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			}, undefined, undefined, ctx);
		}

		if (
			tag.associatedAlters.includes(alter.alterId.toString()) ||
			alter.tagIds.includes(tag.tagId)
		) {
			return await ctx.ephemeral({
				components: new AlertView((await ctx.userTranslations())).errorViewCustom(
					(await (await ctx.userTranslations()))
						.TAG_ALREADY_ASSIGNED.replaceAll(
							"%tag%",
							` ${getEmojiFromTagColor(tag.tagColor)}  ${tag.tagFriendlyName}`,
						)
						.replaceAll("%alter%", alter.username),
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			}, undefined, undefined, ctx);
		}

		await alterCollection.updateOne(
			{ alterId: alter.alterId, systemId },
			{ $push: { tagIds: tag.tagId } },
		);
		await tagCollection.updateOne(
			{ tagId: tag.tagId, systemId },
			{ $push: { associatedAlters: alter.alterId.toString() } },
		);

		w(ctx.author.id, "alter.update", {
			type: "alter.update",
			alter: {
				...alter,
				tagIds: [...alter.tagIds, tag.tagId],
			},
		});

		w(ctx.author.id, "tag.update", {
			type: "tag.update",
			tag: {
				...tag,
				associatedAlters: [...tag.associatedAlters, alter.alterId.toString()],
			},
		});

		return await ctx.ephemeral({
			components: new AlertView((await ctx.userTranslations())).successViewCustom(
				((await ctx.userTranslations()))
					.ASSIGNED_TAG.replaceAll(
						"%tag%",
						` ${getEmojiFromTagColor(tag.tagColor)}  ${tag.tagFriendlyName}`,
					)
					.replaceAll("%alter%", alter.username),
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		}, undefined, undefined, ctx);
	}
}
