import { ServerConfigView } from "@/views/server-cfg";
import { CommandContext, Declare, Middlewares, Options, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "errors",
	description: "View guild errors that occured previously.",
})
@Middlewares(["ensureGuildPermissions"])
export default class ServerErrors extends SubCommand {
    override async run(ctx: CommandContext) {
        const pluralGuild = await ctx.retrievePGuild();
        const nativeGuild = await ctx.guild()
        
        if (!nativeGuild) throw new Error("What.")

		return await ctx.ephemeral({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"errors",
					pluralGuild.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).errorSettings(
					pluralGuild,
					nativeGuild
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
    }
}