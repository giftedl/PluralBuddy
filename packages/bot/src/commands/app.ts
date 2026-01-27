import { emojis } from "@/lib/emojis";
import { AlertView } from "@/views/alert";
import { Command, CommandContext, Container, createUserOption, Declare, Message, TextDisplay } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
    name: "app",
    description: "Explain how PluralBuddy users are not [APP]'s",
    aliases: ["bot", "app", "explain"]
})
export default class AppExplanationCommand extends Command {
    override async run(ctx: CommandContext) {
        const guild = await ctx.retrievePGuild();

        if (guild.getFeatures().disabledAppExplain) {
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
                new TextDisplay().setContent(`-# ${emojis.reply} Why is an \`[APP]\`/\`[BOT]\` user talking in chat?`),
                new Container().setComponents(
                    new TextDisplay().setContent(`### This server uses an application named PluralBuddy, a _plurality_ bot. 
This bot serves people that would like to serve under a different identity while being on the same Discord account.

However, PluralBuddy uses a Discord feature named webhooks, which requires all messages sent by webhooks to have the \`[APP]\` tag, or on older clients, the \`[BOT]\` tag. However, users proxying with PluralBuddy are not bots; infact PluralBuddy takes steps to ensure they aren't.

Many servers have rules specific to PluralBuddy. Please check in with a server administrator regarding these topics if you have further questions.`)
                ).setColor("#FCCEE8")
            ],
            flags: MessageFlags.IsComponentsV2
        })
    }
}