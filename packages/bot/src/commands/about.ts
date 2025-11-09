/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type CommandContext, Container, Declare, TextDisplay } from "seyfert";
import { BaseErrorCommand } from "../base-error-command";
import { buildNumber } from "..";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "about",
	description: "PluralBuddy!"
})
export default class SystemCommand extends BaseErrorCommand {
	override async run(ctx: CommandContext) {

        return await ctx.write({
            components: [
                new Container()
                    .setComponents(
                        new TextDisplay()
                            .setContent(
                                ctx.userTranslations().ABOUT_PB
                                    .replace("%version%", String(buildNumber))
                                    .replace("%branch%", process.env.BRANCH ?? "unknown")
                            )
                    )
            ],
            flags: MessageFlags.IsComponentsV2
        });
    }
}