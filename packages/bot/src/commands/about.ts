/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Command, type CommandContext, Container, Declare, Message, TextDisplay } from "seyfert";
import { buildNumber } from "..";
import { MessageFlags } from "seyfert/lib/types";
import { emojis } from "../lib/emojis";
import { mentionCommand } from "@/lib/mention-command";
import { AlertView } from "@/views/alert";

@Declare({
    name: "about",
    description: "PluralBuddy!",
    contexts: ["BotDM", "Guild"],
    aliases: ["info"]
})
export default class SystemCommand extends Command {
    override async run(ctx: CommandContext) {
        const guild = await ctx.retrievePGuild();

        if (guild.getFeatures().disabledAbout) {
            if (ctx.isChat() && ctx.message) {
                (ctx.message as Message).delete()

                await (ctx.message as Message).author.write({
                    components: new AlertView(ctx.userTranslations()).errorView("FEATURE_DISABLED_GUILD"),
                    flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
                })
                return;
            }

            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("FEATURE_DISABLED_GUILD"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

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
                    ).setColor("#FCCEE8")
            ],
            flags: MessageFlags.IsComponentsV2
        });
    }
}