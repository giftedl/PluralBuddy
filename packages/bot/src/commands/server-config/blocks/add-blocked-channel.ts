import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	CommandContext,
	Container,
	createChannelOption,
	Declare,
	Group,
	Middlewares,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	channel: createChannelOption({
		description: "Channel to add to the block list.",
		required: true,
	}),
};

@Declare({
	name: "add-channel",
	description: "Add a new server blocked channel.",
	aliases: ["ac"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blacklist")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const guildObj = await ctx.retrievePGuild();
		const { channel } = ctx.options;

		if (guildObj.blockedChannels.includes(channel.id)) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"BLACKLIST_ALREADY_EXISTS",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		if (guildObj.blockedChannels.length >= 25) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"TOO_MANY_BLACKLIST_ITEMS",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		guildObj.blockedChannels.push(channel.id);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $push: { blockedChannels: channel.id } },
			{ upsert: true }
		);
		ctx.client.cache.pguild.remove(guildObj.guildId);

		return await ctx.editResponse({
			components: new AlertView((await ctx.userTranslations())).successViewCustom(
				`${(await ctx.userTranslations()).SUCCESS_ADD_ITEM_BLACKLIST.replace("%item%", `<#${channel.id}>`)} ${((await ctx.userTranslations()))
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
