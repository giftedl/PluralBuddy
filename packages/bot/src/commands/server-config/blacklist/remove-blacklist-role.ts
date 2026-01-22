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
	createRoleOption,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	role: createRoleOption({
		description: "Role to remove from blacklist.",
		required: true,
	}),
};

@Declare({
	name: "remove-role",
	description: "Remove a server blacklist role.",
	aliases: ["rr"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blacklist")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const guildObj = await ctx.retrievePGuild();
		const { role } = ctx.options;

		guildObj.blacklistedRoles = guildObj.blacklistedRoles.filter((c) => c !== role.id);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $pull: { blacklistedRoles: role.id } },
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(`${ctx.userTranslations().SUCCESS_REMOVE_ITEM_BLACKLIST.replace("%item%", `<@&${role.id}>`)} ${ctx
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
