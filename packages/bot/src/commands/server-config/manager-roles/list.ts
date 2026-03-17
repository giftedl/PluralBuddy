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
	description: "List manager roles.",
	aliases: ["l"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("manager-roles")
export default class ListPrefixesCommand extends SubCommand {
	override async run(ctx: CommandContext) {
		await ctx.deferReply(true);
		const guildObj = await ctx.retrievePGuild();

		return await ctx.editResponse({
			components: [
				new Container().setComponents(
					new TextDisplay().setContent(
                        "\`                                                           \`\n" +
						guildObj.managerRoles
							.map((c) => `> - <@&${c}>`)
							.join("\n"),
					),
				).setColor("#4cc270"),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            allowed_mentions: { parse: [] }
		});
	}
}
