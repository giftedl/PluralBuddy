/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { alterCollection, tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { TagView } from "@/views/tags";
import {
	type CommandContext,
	createBooleanOption,
	Declare,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"query-tags": createBooleanOption({
		description: "Whether to include tags in the random selection.",
		aliases: ["qt", "t"],
		flag: true
	}),
};

@Declare({
	name: "random",
	description: "Get a random alter or tag.",
	aliases: ["r"],
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class RandomSystemCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const user = await ctx.retrievePUser();
		const { "query-tags": queryTags } = ctx.options;

		if (user.system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}
		let tagQuery:
			| {
					tag: string;
					type: "tag";
			  }[]
			| null = null;
		if (queryTags) {
			tagQuery = await tagCollection
				.aggregate<{ tag: string; type: "tag" }>([
					{ $match: { systemId: user.userId } },
					{ $sample: { size: 1 } },
					{ $project: { tag: "$tagId", type: "tag" } },
				])
				.toArray();
		}

		const randomQuery = await alterCollection
			.aggregate<{ alter: string; type: "alter" }>([
				{ $match: { systemId: user.userId } },
				{ $sample: { size: 1 } },
				{ $project: { alter: "$alterId", type: "alter" } },
			])
			.toArray();
			

		if (queryTags) {
			const finalQuery = Math.random() > 0.5 ? randomQuery : tagQuery;

			if (finalQuery === null || finalQuery[0] === undefined) {
				return await ctx.write({
					components: new AlertView(ctx.userTranslations()).errorView(
						"INSUFFICIENT_DATA_SIZE",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				});
			}

			if (finalQuery[0].type === "tag") {

				const tagQuery = await tagCollection.findOne({
					systemId: user.userId,
					tagId: finalQuery[0].tag,
				});

				if (tagQuery === null) {
					return await ctx.write({
						components: new AlertView(ctx.userTranslations()).errorView(
							"INSUFFICIENT_DATA_SIZE",
						),
						flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
					});
				}

				return await ctx.ephemeral({
					components: [
						...(new TagView(ctx.userTranslations()).tagProfileView(tagQuery, tagQuery.systemId !== ctx.author.id)),
						...(tagQuery.systemId === ctx.author.id ? new TagView(ctx.userTranslations()).tagConfigureButton(tagQuery) : [])
					],
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					allowed_mentions: { parse: [] }
				}, true)
			}

			if (finalQuery[0].type === "alter") {
				const alterQuery = await alterCollection.findOne({
					systemId: user.userId,
					alterId: Number(finalQuery[0].alter),
				});
		
				if (alterQuery === null) {
					return await ctx.write({
						components: new AlertView(ctx.userTranslations()).errorView(
							"INSUFFICIENT_DATA_SIZE",
						),
						flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
					});
				}
		
				return await ctx.ephemeral({
					components: [
						...(await new AlterView(ctx.userTranslations()).alterProfileView(
							alterQuery,
							alterQuery.systemId !== ctx.author.id,
						)),
						...new AlterView(ctx.userTranslations()).alterConfigureButton(
							alterQuery,
						),
						...new AlterView(ctx.userTranslations()).alterProxyModes(alterQuery),
					],
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					allowed_mentions: { parse: [] },
				});
			}
		}

		if (randomQuery[0] === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"INSUFFICIENT_DATA_SIZE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const alterQuery = await alterCollection.findOne({
			systemId: user.userId,
			alterId: Number(randomQuery[0].alter),
		});

		if (alterQuery === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"INSUFFICIENT_DATA_SIZE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.ephemeral({
			components: [
				...(await new AlterView(ctx.userTranslations()).alterProfileView(
					alterQuery,
					alterQuery.systemId !== ctx.author.id,
				)),
				...new AlterView(ctx.userTranslations()).alterConfigureButton(
					alterQuery,
				),
				...new AlterView(ctx.userTranslations()).alterProxyModes(alterQuery),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { parse: [] },
		});
	}
}
