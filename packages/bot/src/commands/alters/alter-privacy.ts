/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type CommandContext, createStringOption, Declare, Options, SubCommand } from "seyfert"
import { autocompleteAlters } from "@/lib/autocomplete-alters"

const options = {
    "alter-name": createStringOption({
        description: "The name of the alter.",
        required: true,
        autocomplete: autocompleteAlters
    })
}

@Declare({
	name: "banner",
	description: "Set an alter's banner.",
    aliases: ["b"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class EditAlterPrivacyCommand extends SubCommand {
    override async run(context: CommandContext) {
        
    }
}