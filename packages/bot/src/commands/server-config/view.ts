import { AlertView } from "@/views/alert";
import { ServerConfigView } from "@/views/server-cfg";
import { CommandContext, Declare, Middlewares, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "view",
	description: "View server configuration in PluralBuddy.",
})
@Middlewares(["ensureGuildPermissions"])
export default class ViewServerConfig extends SubCommand {
	override async run(ctx: CommandContext) {
		const pluralGuild = await ctx.retrievePGuild();

		return await ctx.ephemeral({
			components: [
				...new ServerConfigView(ctx.userTranslations()).topView(
					"general",
					pluralGuild.guildId,
				),
				...new ServerConfigView(ctx.userTranslations()).generalSettings(
					pluralGuild,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		});
	}
}
