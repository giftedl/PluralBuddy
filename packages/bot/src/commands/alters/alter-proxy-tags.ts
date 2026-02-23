/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type CommandContext, createStringOption, Declare, Options } from "seyfert";
import { SubCommand } from "seyfert"
import { MessageFlags } from "seyfert/lib/types";
import { SystemSettingsView } from "../../views/system-settings";
import { alterCollection } from "../../mongodb";
import { AlertView } from "../../views/alert";
import { AlterView } from "../../views/alters";
import { autocompleteAlters } from "../../lib/autocomplete-alters";

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter.",
        required: true,
        autocomplete: autocompleteAlters
    })
}

@Declare({
	name: "add-proxy-tags",
	description: "Modify the proxy tags of a alter",
    aliases: ["proxy", "proxy-tags", "pt", "ptags", "apts", "tags", "tag"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class EditAlterProxyTagsCommand extends SubCommand {
    
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
                ...new AlterView(ctx.userTranslations()).alterTopView("proxy-tags", alter.alterId.toString(), alter.username),
                ...new AlterView(ctx.userTranslations()).alterProxyTagsView(alter)
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
    }
}