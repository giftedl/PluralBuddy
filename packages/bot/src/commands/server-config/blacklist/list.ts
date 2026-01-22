import {
	CommandContext,
	Container,
	createStringOption,
	Declare,
	Group,
	Middlewares,
	Options,
	SubCommand,
	TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Shortcut } from "yunaforseyfert";

@Declare({
	name: "list",
	description: "List server blacklist.",
	aliases: ["l"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("blacklist")
export default class ListPrefixesCommand extends SubCommand {
	override async run(ctx: CommandContext) {
		const guildObj = await ctx.retrievePGuild();

		return await ctx.write({
			components: [
				new Container().setComponents(
					new TextDisplay().setContent("\`                                                           \`\n" +
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
					),
				).setColor("#4cc270"),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            allowed_mentions: { parse: [] }
		});
	}
}
