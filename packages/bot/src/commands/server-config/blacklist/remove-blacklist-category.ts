import { guildCollection } from "@/mongodb";
import { getGuildFromId } from "@/types/guild";
import { AlertView } from "@/views/alert";
import {
	Middlewares,
	Group,
	SubCommand,
	Declare,
	CommandContext,
	createStringOption,
	Options,
	createChannelOption,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	category: createStringOption({
		description: "Category to remove from blacklist.",
		required: true,
	}),
};

@Declare({
	name: "remove-category",
	description: "Remove a server blacklist category.",
	aliases: ["rct"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blacklist")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const guildObj = await ctx.retrievePGuild();
		const { category } = ctx.options;
        const categoryObj = await (await ctx.guild())?.channels.fetch(category).catch(() => null);

        if (!categoryObj || !categoryObj.isCategory()) {
            return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"NOT_A_CATEGORY",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			})
        }

		guildObj.blacklistedCategories = guildObj.blacklistedCategories.filter((c) => c !== category);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $pull: { blacklistedCategories: category } },
		);
		ctx.client.cache.pguild.remove(guildObj.guildId)

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(`${ctx.userTranslations().SUCCESS_REMOVE_ITEM_BLACKLIST.replace("%item%", categoryObj.name)} ${ctx
				.userTranslations()
				.SUCCESS_CHANGED_SERVER_BLACKLIST.replace(
					"%blacklist_items%",
					[
						...guildObj.blacklistedChannels.map((c) => {
							return { id: c, type: "channel" };
						}),
						...guildObj.blacklistedRoles.map((c) => {
							return { id: c, type: "role" };
						}),
						...(await Promise.all(guildObj.blacklistedCategories.map(async (c) => {
							const category = await ctx.client.channels.fetch(c).catch(() => null);

							if (!category || !category.isCategory()) {
								return null;
							}

							return { id: category.name, type: "category"}
						}))).filter(v => v !== null)
					]
						.map((c) => `> - ${c.type === "channel" ? "<#" : (c.type === "category" ? "" : "<@&")}${c.id}${c.type !== "category" ? ">" : ""}`)
						.join("\n"),
				)}`
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { parse: [] }
		});
	}
}
