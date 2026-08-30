/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { AlertView } from "../../views/alert";
import { SystemSettingsView } from "../../views/system-settings";

@Declare({
	name: "terminology",
	description: "Configure the system's terminology",
	aliases: ["terms"],
	contexts: ["BotDM", "Guild"],
})
export default class SystemConfigCommand extends SubCommand {
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
					...new SystemSettingsView(
						await ctx.userTranslations(),
						getSystemFeatures(user.system)?.preferAccessiblity,
					).topView("terminology", user.system.associatedUserId),
					...(await new SystemSettingsView(
						await ctx.userTranslations(),
						getSystemFeatures(user.system)?.preferAccessiblity,
					).terminologySettings(user.system)),
				],
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			},
			undefined,
			undefined,
			ctx,
		);
	}
}
