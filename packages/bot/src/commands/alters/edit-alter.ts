/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Command, AutoLoad, Declare, CommandContext } from "seyfert";

@Declare({
	name: "edit-alter",
	description: "alter command",
    aliases: ["ea", "em", "edit-member"],
    contexts: ["BotDM", "Guild"]
})
@AutoLoad()
export default class EditAlterRootCommand extends Command {}