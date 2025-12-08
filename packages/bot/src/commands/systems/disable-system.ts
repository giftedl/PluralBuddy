/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import { CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "toggle",
	description: "Disable/enable the system from proxying.",
	aliases: ["d"],
	contexts: ["BotDM", "Guild"],
})
export default class DisableSystemCommand extends SubCommand {
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

		await createSystemOperation(
			user.system,
			{ disabled: !user.system.disabled },
			ctx.userTranslations(),
			"discord",
		);

		return await ctx.write({
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			components: new AlertView(ctx.userTranslations()).successView(
				user.system.disabled ? "ENABLED_SYSTEM" : "DISABLED_SYSTEM",
			),
		});
	}
}
