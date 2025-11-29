/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { createBooleanOption } from "seyfert";
import { Command, type CommandContext, createStringOption, Declare } from "seyfert";

const options = {
    "tag-name": createStringOption({
        description: "Name of the tag to query. You can use `<user-id>/<tag>` for tags from other systems.",
        required: true
    }),
    public: createBooleanOption({
        description: 'Do you want to expose this publicly? (non-ephemeral)',
    })
}

@Declare({
	name: "tag",
	description: "Query a tag",
    aliases: ["t"],
    contexts: ["BotDM", "Guild"]
})
export default class TagCommand extends Command {
	override async run(ctx: CommandContext) {
        const user = await ctx.retrievePUser();

        
    }

}