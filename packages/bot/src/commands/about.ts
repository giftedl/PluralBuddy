/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Command, type CommandContext, Container, Declare, Message, TextDisplay } from "seyfert";
import { buildNumber } from "..";
import { MessageFlags } from "seyfert/lib/types";
import { emojis } from "../lib/emojis";
import { mentionCommand } from "@/lib/mention-command";

@Declare({
    name: "about",
    description: "PluralBuddy!",
    contexts: ["BotDM", "Guild"]
})
export default class SystemCommand extends Command {
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
                                    .replace("%catjamming%", emojis.catjamming)
                                    .replace("%github%", emojis.github)
                                    .replace("%docs%", emojis.book)
                                    .replace("%linein%", emojis.lineIn)
                                    .replace("%lineright%", emojis.lineRight)
                                    .replace("%command%", mentionCommand(await ctx.getDefaultPrefix() ?? "pb;", "setup", ctx.message === undefined))
                            )
                    )
            ],
            flags: MessageFlags.IsComponentsV2
        });
    }
}