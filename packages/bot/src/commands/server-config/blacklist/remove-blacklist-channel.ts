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
		description: "Channel to remove from blacklist.",
		required: true,
	}),
};

@Declare({
	name: "remove-channel",
	description: "Remove a server blacklist channel.",
	aliases: ["rc"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blacklist")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const guildObj = await ctx.retrievePGuild();
		const { channel } = ctx.options;

		guildObj.blacklistedChannels = guildObj.blacklistedChannels.filter((c) => c !== channel.id);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $pull: { blacklistedChannels: channel.id } },
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(`${ctx.userTranslations().SUCCESS_REMOVE_ITEM_BLACKLIST.replace("%item%", `<#${channel.id}>`)} ${ctx
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
					]
						.map((c) => `> - ${c.type === "channel" ? "<#" : "<@&"}${c.id}>`)
						.join("\n"),
				)}`
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			allowed_mentions: { parse: [] }
		});
	}
}
