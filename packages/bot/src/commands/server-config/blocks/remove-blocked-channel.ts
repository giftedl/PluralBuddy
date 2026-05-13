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
	channel: createChannelOption({
		description: "Channel to unblock.",
		required: true,
	}),
};

@Declare({
	name: "remove-channel",
	description: "Remove a server blocked channel.",
	aliases: ["rc"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blocks")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const guildObj = await ctx.retrievePGuild();
		const { channel } = ctx.options;

		guildObj.blockedChannels = guildObj.blockedChannels.filter((c) => c !== channel.id);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $pull: { blockedChannels: channel.id } },
			{ upsert: true }
		);
		ctx.client.cache.pguild.remove(guildObj.guildId)

		return await ctx.editResponse({
			components: new AlertView((await ctx.userTranslations())).successViewCustom(`${(await ctx.userTranslations()).SUCCESS_REMOVE_ITEM_BLOCKED.replace("%item%", `<#${channel.id}>`)} ${(await ctx.userTranslations())
				.SUCCESS_CHANGED_SERVER_BLOCKS.replace(
					"%block_items%",
					[
						...guildObj.blockedChannels.map((c) => {
							return { id: c, type: "channel" };
						}),
						...guildObj.blockedRoles.map((c) => {
							return { id: c, type: "role" };
						}),
						...(await Promise.all(guildObj.blockedCategories.map(async (c) => {
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
