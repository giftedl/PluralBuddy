/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { NudgePreferences } from "@/views/nudge-preferences";
import { Command, CommandContext, Declare } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "nudge-preferences",
	description: "Configure options about nudging",
	aliases: ["nudge-pref", "np"],
	contexts: ["Guild", "BotDM"],
})
export default class NudgePreferencesCommand extends Command {
    override async run(ctx: CommandContext) {
		let user = await ctx.retrievePUser();

		// Database migration (12/04/25)
		if (user.nudging === undefined) {
			await userCollection.updateOne(
				{ userId: user.userId },
				{ $set: { nudging: { blockedUsers: [], currentlyEnabled: true } } },
			);

			// Set user in memory
			user.nudging = { blockedUsers: [], currentlyEnabled: true };
		}
		// End database migration
        
		return await ctx.write({
			components: new NudgePreferences(ctx.userTranslations()).nudgePreferences(user),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
    }
}