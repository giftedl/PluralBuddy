/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Command, type CommandContext, Container, Declare, Emoji, TextDisplay } from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { PluralBuddyIntro } from "../views/pluralbuddy-intro";
import { AlertView } from "../views/alert";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { emojis } from "../lib/emojis";
import { BaseErrorCommand } from "@/base-error-command";

@Declare({
    name: 'setup',
    description: "Setup a PluralBuddy system.",
    aliases: ["set"],
    contexts: ["BotDM", "Guild"]
})
export default class SetupCommand extends BaseErrorCommand {

    override async run(ctx: CommandContext) {
        const user = await ctx.retrievePUser();

        if (user.system !== undefined) {
            return await ctx.ephemeral({
                components: [
                    ...new AlertView(ctx.userTranslations()).errorView("SETUP_ERROR_SYSTEM_ALREADY_EXISTS"), 
                    new ActionRow()
                        .setComponents(
                            new Button()
                                .setEmoji(emojis.xWhite)
                                .setStyle(ButtonStyle.Danger)
                                .setLabel(ctx.userTranslations().SETUP_ERROR_SYSTEM_ALREADY_EXISTS_BTN)
                                .setCustomId(InteractionIdentifier.Setup.RemoveOldSystem.create())
                        )
                ],
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }
        
        ctx.ephemeral({
            components: new PluralBuddyIntro(ctx.userTranslations()).pageOne(),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
    }
}