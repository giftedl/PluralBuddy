/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Command, type CommandContext, Declare, SubCommand } from "seyfert";
import { AlertView } from "../../views/alert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "../../lib/interaction-ids";
import { emojis } from "../../lib/emojis";

@Declare({
    name: 'delete',
    description: "Removes the system",
})
export default class SetupCommand extends SubCommand {
	override async run(ctx: CommandContext) {
        return await ctx.ephemeral({
            components: [
                ...new AlertView(ctx.userTranslations()).questionView("CONFIRMATION_SYSTEM_DELETION"),

                new ActionRow()
                    .setComponents(
                        new Button()
                            .setEmoji(emojis.circleQuestionWhite)
                            .setStyle(ButtonStyle.Primary)
                            .setLabel(ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION_BTN)
                            .setCustomId(InteractionIdentifier.Systems.DeleteSystem.create())
                    )
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
	}
}