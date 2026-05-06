import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	CommandContext,
	createChannelOption,
	createStringOption,
	Declare,
	Group,
	Middlewares,
	Options,
	SubCommand,
} from "seyfert";
import { ChannelType, MessageFlags } from "seyfert/lib/types";

const options = {
	category: createStringOption({
		description: "Category ID to add to the block list.",
		required: true,
	}),
};

@Declare({
	name: "add-category",
	description: "Add a new server blocked category.",
	aliases: ["act"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blacklist")
@Options(options)
export default class AddBlockCategory extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const guildObj = await ctx.retrievePGuild();
		const { category } = ctx.options;
		const categoryObj = await (await ctx.guild())?.channels
			.fetch(category)
			.catch(() => null);

		if (!categoryObj || !categoryObj.isCategory()) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"NOT_A_CATEGORY",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		if (guildObj.blockedCategories.includes(category)) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"BLACKLIST_ALREADY_EXISTS",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		if (guildObj.blockedCategories.length >= 25) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"TOO_MANY_BLACKLIST_ITEMS",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		guildObj.blockedCategories.push(category);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $push: { blockedCategories: category } },
			{ upsert: true }
		);
		ctx.client.cache.pguild.remove(guildObj.guildId);

		return await ctx.editResponse({
			components: new AlertView((await ctx.userTranslations())).successViewCustom(
				`${(await ctx.userTranslations()).SUCCESS_ADD_ITEM_BLACKLIST.replace("%item%", categoryObj.name)} ${((await ctx.userTranslations()))
					.SUCCESS_CHANGED_SERVER_BLACKLIST.replace(
						"%blacklist_items%",
						[
							...guildObj.blockedCategories.map((c) => {
								return { id: c, type: "channel" };
							}),
							...guildObj.blockedRoles.map((c) => {
								return { id: c, type: "role" };
							}),
							...(
								await Promise.all(
									guildObj.blockedCategories.map(async (c) => {
										const category = await ctx.client.channels
											.fetch(c)
											.catch(() => null);

										if (!category || !category.isCategory()) {
											return null;
										}

										return { id: category.name, type: "category" };
									}),
								)
							).filter((v) => v !== null),
						]
							.map(
								(c) =>
									`> - ${c.type === "channel" ? "<#" : c.type === "category" ? "" : "<@&"}${c.id}${c.type !== "category" ? ">" : ""}`,
							)
							.join("\n"),
					)}`,
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { parse: [] },
		});
	}
}
