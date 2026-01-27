import { ServerConfigView } from "@/views/server-cfg";
import { AutoLoad, Command, CommandContext, Declare, Groups } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "server-config",
	description: "Configure server settings",
	aliases: ["srvcfg", "servercfg", "cfg", "srv-cfg"],
})
@AutoLoad()
@Groups({
	prefixes: {
		defaultDescription: "Guild prefixes.",
		aliases: ["prf", "prx"],
	},
	blacklist: {
		defaultDescription: "Guild blacklist.",
		aliases: ["blist", "b"],
	},
	"manager-roles": {
		defaultDescription: "Guild manager roles.",
		aliases: ["mr-role", "mr-roles", "mrole", "mr"],
	},
	"role-containers": {
		defaultDescription: "Role containers.",
		aliases: ["containers", "roles", "rc"]
	}
})
export default class ServerConfigCommand extends Command {
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
