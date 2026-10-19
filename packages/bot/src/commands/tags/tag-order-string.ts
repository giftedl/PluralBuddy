import {
	type CommandContext,
	Container,
	createStringOption,
	Declare,
	Options,
	SubCommand,
	TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { autocompleteTags } from "@/lib/autocomplete-tags";
import { tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { w } from "@/webhooks";

const options = {
	"tag-name": createStringOption({
		description: "The name of the tag to modify.",
		required: true,
		autocomplete: autocompleteTags,
	}),
	"tag-order-string": createStringOption({
		description: "The new order string for the tag.",
		max_length: 4,
	}),
};

@Declare({
	name: "order-string",
	description: "Edit the order string of a tag",
	aliases: ["o"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class EditTagOrderStringCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const { "tag-name": tagName, "tag-order-string": tagOrderString } =
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

		if (tagOrderString === undefined) {
			return await ctx.ephemeral(
				{
					components: [
						new Container().setComponents(
							new TextDisplay().setContent(`\`\`\`
    ${tag.orderString ?? "⛔ Your tag has no order string."}
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
			{ $set: { orderString: tagOrderString } },
		);

		w(ctx.author.id, "tag.update", {
			type: "tag.update",
			tag: {
				...tag,
				orderString: tagOrderString,
			},
		});

		return await ctx.editResponse({
			components: [
				...new AlertView(await ctx.userTranslations()).successViewCustom(
					(await ctx.userTranslations()).TAG_SUCCESS_ORDER.replace(
						"%tag%",
						tag.tagFriendlyName,
					),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
