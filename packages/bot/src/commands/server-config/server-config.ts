import { ServerConfigView } from "@/views/server-cfg";
import { AutoLoad, Command, CommandContext, Declare, Groups, Middlewares } from "seyfert";
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
@Middlewares(["ensureGuildPermissions"])
export default class ServerConfigCommand extends Command {
	override async run(ctx: CommandContext) {
		await ctx.deferReply(true);
		const pluralGuild = await ctx.retrievePGuild();

		return await ctx.ephemeral({
			components: [
				...new ServerConfigView((await ctx.userTranslations())).topView(
					"general",
					pluralGuild.guildId,
				),
				...await new ServerConfigView((await ctx.userTranslations())).generalSettings(
					pluralGuild,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { parse: [] },
		}, undefined, undefined, ctx);
	}
}
