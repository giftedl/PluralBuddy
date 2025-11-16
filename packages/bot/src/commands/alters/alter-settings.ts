/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { BaseErrorSubCommand } from "@/base-error-subcommand";
import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { type CommandContext, createStringOption, Declare, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter to modify.",
        required: true,
        autocomplete: autocompleteAlters
    })
}

@Declare({
	name: "config",
	description: "Modify the config of an alter",
    aliases: ["settings", "s"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class AlterConfigCommand extends BaseErrorSubCommand {
	override async run(ctx: CommandContext<typeof options>) {

        const { "alter-name": alterName } = ctx.options;
        const systemId = ctx.author.id;
        const query = Number.isNaN(Number.parseInt(alterName)) 
            ? alterCollection.findOne( { $or: [ { username: alterName } ], systemId })
            : alterCollection.findOne( { $or: [ { username: alterName }, { alterId: Number(alterName) } ], systemId })
        const alter = await query;

        if (alter === null) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return await ctx.ephemeral({
            components: [
                ...new AlterView(ctx.userTranslations()).alterTopView(
                    "general",
                    alter.alterId.toString(),
                    alter.username,
                ),
                ...new AlterView(ctx.userTranslations()).alterGeneralView(alter),
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
        });
    }
}