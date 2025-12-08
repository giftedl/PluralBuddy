/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";
import { type CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "alters",
	description: "Configure the system",
	aliases: ["a", "m", "members"],
	contexts: ["BotDM", "Guild"],
})
export default class AlterListCommand extends SubCommand {
	override async run(ctx: CommandContext) {
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.ephemeral({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.ephemeral({
			components: [
				...await new SystemSettingsView(ctx.userTranslations()).altersSettings(
					user.system,
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
	}
}
