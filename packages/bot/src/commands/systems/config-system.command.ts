/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type CommandContext, Declare, SubCommand } from "seyfert";
import { AlertView } from "../../views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { SystemSettingsView } from "../../views/system-settings";

@Declare({
	name: "config",
	description: "Configure the system",
	aliases: ["configure", "c", "s", "settings"],
	contexts: ["BotDM", "Guild"],
})
export default class SystemConfigCommand extends SubCommand {
	override async run(ctx: CommandContext) {
		await ctx.deferReply(true);
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral(
				{
					components: new AlertView((await ctx.userTranslations())).errorView(
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
					...new SystemSettingsView((await ctx.userTranslations())).topView(
						"general",
						user.system.associatedUserId,
					),
					...new SystemSettingsView((await ctx.userTranslations())).generalSettings(
						user.system,
						ctx.guildId,
					),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			},
			undefined,
			undefined,
			ctx,
		);
	}
}
