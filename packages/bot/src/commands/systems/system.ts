/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { Declare, Command, AutoLoad, type CommandContext, Message } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { SystemView } from "../../views/system";
import { AlertView } from "../../views/alert";
import { BaseErrorCommand } from "@/base-error-command";

@Declare({
	name: "system",
	description: "system command",
    aliases: ["s"],
    contexts: ["BotDM", "Guild"]
})
// Being in the same folder with @AutoLoad() you can save this step
@AutoLoad()
export default class SystemCommand extends BaseErrorCommand {
	override async run(ctx: CommandContext) {
        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return ctx.ephemeral({
            components: [
                ...(new SystemView(ctx.userTranslations()).systemProfileView(user.system)),
                ...(new SystemView(ctx.userTranslations()).systemConfigureButton(user.system)),
            ],
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        }, true)
    }
}