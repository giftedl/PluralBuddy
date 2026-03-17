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
    description: "List server prefixes.",
    aliases: ["l"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("prefixes")
export default class ListPrefixesCommand extends SubCommand {
    override async run(ctx: CommandContext) {
		await ctx.deferReply(true);
        const guildObj = await ctx.retrievePGuild();

        return await ctx.editResponse({
            components: [
                new Container().setComponents(
                    new TextDisplay().setContent("`                                                           `\n"),
                    new TextDisplay().setContent(`\`\`\`\n${guildObj.prefixes.join(",")}\n\`\`\``),
                    new TextDisplay().setContent(guildObj.prefixes.map((c) => `> - ${c}`).join("\n"))
                )
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
        })
    }
}
