/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Middlewares, SubCommand } from "seyfert"
import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { ActionRow, Button, type CommandContext, createStringOption, Declare, Options } from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter to modify.",
        required: true,
        autocomplete: autocompleteAlters
    }),
}

@Declare({
	name: "delete",
	description: "Remove an alter",
    aliases: ["remove", "r"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class DeleteAlterCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
        
        const { "alter-name": alterName } = ctx.options;
        const systemId = ctx.author.id;
        const alter = ctx.contextAlter() ?? await (Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId }))

        
        if (alter === null) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }
        

        return await ctx.ephemeral({
            components: [
                ...new AlertView(ctx.userTranslations()).questionViewCustom(ctx.userTranslations().CONFIRMATION_ALTER_DELETION.replace("%alter%", alter.username)),

                new ActionRow()
                    .setComponents(
                        new Button()
                            .setEmoji(emojis.circleQuestionWhite)
                            .setStyle(ButtonStyle.Primary)
                            .setLabel(ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION_BTN)
                            .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.RemoveAlterConfirm.create(alter.alterId))
                    )
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
    }

}