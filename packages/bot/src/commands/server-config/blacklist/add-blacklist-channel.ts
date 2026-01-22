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
		description: "Channel to add to blacklist.",
		required: true,
	}),
};

@Declare({
	name: "add-channel",
	description: "Add a new server blacklist channel.",
	aliases: ["ac"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blacklist")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const guildObj = await ctx.retrievePGuild();
		const { channel } = ctx.options;

		if (guildObj.blacklistedChannels.includes(channel.id)) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"BLACKLIST_ALREADY_EXISTS",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

        if (guildObj.blacklistedChannels.length >= 25) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("TOO_MANY_BLACKLIST_ITEMS"),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            })
        }

		guildObj.blacklistedChannels.push(channel.id);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $push: { blacklistedChannels: channel.id } },
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				`${ctx.userTranslations().SUCCESS_ADD_ITEM_BLACKLIST.replace("%item%", `<#${channel.id}>`)} ${ctx
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
					)}`,
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            allowed_mentions: { parse: [] }
		});
	}
}
