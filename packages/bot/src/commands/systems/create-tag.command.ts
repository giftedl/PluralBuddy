/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { SubCommand } from "seyfert"
import { type CommandContext, createStringOption, Declare, Options, type OKFunction } from "seyfert";

const options = {
    "display-name": createStringOption({
        description: 'The display name for the tag.',
        required: true,
        max_length: 20,
    })
};

@Declare({
    name: 'create-tag',
    description: "Creates a new tag",
    aliases: ["ct", "tag", "new-tag", "cat"],
    contexts: ["BotDM", "Guild"]
})
@Options(options)
export default class CreateTagCommand extends SubCommand {
    override async run(context: CommandContext) {
        
    }
}