import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	CommandContext,
	Container,
	createChannelOption,
	createRoleOption,
	Declare,
	Group,
	Middlewares,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	role: createRoleOption({
		description: "Role to add to blacklist.",
		required: true,
	}),
};

@Declare({
	name: "add-role",
	description: "Add a new server blacklist role.",
	aliases: ["ar"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blacklist")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const guildObj = await ctx.retrievePGuild();
		const { role } = ctx.options;

		if (guildObj.blacklistedRoles.includes(role.id)) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"BLACKLIST_ALREADY_EXISTS",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

        if (guildObj.blacklistedRoles.length >= 25) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("TOO_MANY_BLACKLIST_ITEMS"),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            })
        }

		guildObj.blacklistedRoles.push(role.id);

		await guildCollection.updateOne(
			{ guildId: guildObj.guildId },
			{ $push: { blacklistedRoles: role.id } },
		);

		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				`${ctx.userTranslations().SUCCESS_ADD_ITEM_BLACKLIST.replace("%item%", `<@&${role.id}>`)} ${ctx
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
