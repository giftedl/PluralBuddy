/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { AutoLoad, Command, Options, type CommandContext, createStringOption, Declare, createBooleanOption, ActionRow, Button } from "seyfert";
import { alterCollection } from "../mongodb";
import { BaseErrorCommand } from "../base-error-command";
import { AlterView } from "../views/alters";
import { AlertView } from "../views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { autocompleteAlters } from "../lib/autocomplete-alters";

const options = {
    "alter-name": createStringOption({
        description: "Name of the alter to query. You can use `<user_id>/<alter>` for alters from other systems.",
        required: true,
        autocomplete: autocompleteAlters
    }),
    public: createBooleanOption({
        description: 'Do you want to expose this publicly? (non-ephemeral)',
    })
}

@Declare({
	name: "alter",
	description: "alter command",
    aliases: ["a", "m", "member"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class SystemCommand extends BaseErrorCommand {
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
                ...(new AlterView(ctx.userTranslations()).alterProfileView(alter)),
                ...(new AlterView(ctx.userTranslations()).alterConfigureButton(alter))
            ],
            flags: MessageFlags.IsComponentsV2 + (ctx.options.public !== true ? MessageFlags.Ephemeral : 0),
            allowed_mentions: { parse: [] }
        }, true)
        
    }
}