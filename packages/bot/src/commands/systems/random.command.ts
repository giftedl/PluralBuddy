/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	type CommandContext,
	createBooleanOption,
	Declare,
	Message,
	Options,
	SubCommand,
	TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { TagView } from "@/views/tags";

const options = {
	"query-tags": createBooleanOption({
		description: "Whether to include tags in the random selection.",
		aliases: ["qt", "t"],
		flag: true,
	}),

	public: createBooleanOption({
		description: "Do you want to expose this publicly? (non-ephemeral)",
		aliases: ["p"],
		flag: true,
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
		await ctx.deferReply(true);
		const user = await ctx.retrievePUser();
		const { "query-tags": queryTags, public: publicMode } = ctx.options;

		const publicMessage = publicMode
			? publicMode
			: (ctx.message as unknown) instanceof Message
				? (ctx.message as unknown as Message).content.endsWith("-p")
				: publicMode;

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
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
					components: new AlertView(await ctx.userTranslations()).errorView(
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
					return await ctx.editResponse({
						components: new AlertView(await ctx.userTranslations()).errorView(
							"INSUFFICIENT_DATA_SIZE",
						),
						flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
					});
				}

				return await ctx.ephemeral(
					{
						components: [
							...new TagView(await ctx.userTranslations()).tagProfileView(
								tagQuery,
								tagQuery.systemId !== ctx.author.id,
							),
							...(tagQuery.systemId === ctx.author.id
								? new TagView(await ctx.userTranslations()).tagConfigureButton(
										tagQuery,
									)
								: []),
						],
						flags:
							MessageFlags.IsComponentsV2 +
							(ctx.options.public !== true ? MessageFlags.Ephemeral : 0),
						allowed_mentions: { parse: [] },
					},
					true,
					undefined,
					ctx,
				);
			}

			if (finalQuery[0].type === "alter") {
				const alterQuery = await alterCollection.findOne({
					systemId: user.userId,
					alterId: Number(finalQuery[0].alter),
				});

				if (alterQuery === null) {
					return await ctx.editResponse({
						components: new AlertView(await ctx.userTranslations()).errorView(
							"INSUFFICIENT_DATA_SIZE",
						),
						flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
					});
				}

				return await ctx.ephemeral(
					{
						components: [
							...(await new AlterView(
								await ctx.userTranslations(),
							).alterProfileView(
								alterQuery,
								alterQuery.systemId !== ctx.author.id,
							)),
							...(publicMessage && alterQuery.systemId === ctx.author.id
								? [
										new TextDisplay().setContent(
											`-#  ${emojis.lineRight} Some options were hidden because this message is in public mode.`,
										),
									]
								: []),
							...(!publicMessage && alterQuery.systemId === ctx.author.id
								? new AlterView(
										await ctx.userTranslations(),
									).alterConfigureButton(alterQuery)
								: []),
							...(!publicMessage && alterQuery.systemId === ctx.author.id
								? new AlterView(await ctx.userTranslations()).alterProxyModes(
										alterQuery,
										ctx.guildId,
									)
								: []),
						],
						flags:
							MessageFlags.IsComponentsV2 +
							(ctx.options.public !== true ? MessageFlags.Ephemeral : 0),
						allowed_mentions: { parse: [] },
					},
					true,
					undefined,
					ctx,
				);
			}
		}

		if (randomQuery[0] === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
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
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"INSUFFICIENT_DATA_SIZE",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.ephemeral(
			{
				components: [
					...(await new AlterView(
						await ctx.userTranslations(),
					).alterProfileView(
						alterQuery,
						alterQuery.systemId !== ctx.author.id,
					)),
					...(publicMessage && alterQuery.systemId === ctx.author.id
						? [
								new TextDisplay().setContent(
									`-#  ${emojis.lineRight} Some options were hidden because this message is in public mode.`,
								),
							]
						: []),
					...(!publicMessage && alterQuery.systemId === ctx.author.id
						? new AlterView(await ctx.userTranslations()).alterConfigureButton(
								alterQuery,
							)
						: []),
					...(!publicMessage && alterQuery.systemId === ctx.author.id
						? new AlterView(await ctx.userTranslations()).alterProxyModes(
								alterQuery,
								ctx.guildId,
							)
						: []),
				],
				flags:
					MessageFlags.IsComponentsV2 +
					(ctx.options.public !== true ? MessageFlags.Ephemeral : 0),
				allowed_mentions: { parse: [] },
			},
			true,
			undefined,
			ctx,
		);
	}
}
