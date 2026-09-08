import { CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Shortcut } from "yunaforseyfert";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";

@Declare({
	name: "settings",
	description: "Configure the system",
	aliases: ["link", "config"],
	contexts: ["BotDM", "Guild"],
})
@Shortcut()
export default class SyncConfigCommand extends SubCommand {
	override async run(ctx: CommandContext) {
		await ctx.deferReply(true);
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral(
				{
					components: new AlertView(await ctx.userTranslations()).errorView(
						"ERROR_SYSTEM_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		return await ctx.ephemeral(
			{
				components: [
					...(await new SystemSettingsView(
						await ctx.userTranslations(),
						getSystemFeatures(user.system)?.preferAccessiblity,
					).syncSettings(user)),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			},
			undefined,
			undefined,
			ctx,
		);
    }
}