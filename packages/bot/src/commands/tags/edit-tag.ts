/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Command, AutoLoad, Declare } from "seyfert";

@Declare({
	name: "edit-tag",
	description: "tag command",
    aliases: ["et"],
    contexts: ["BotDM", "Guild"]
})
@AutoLoad()
export default class EditTagRootCommand extends Command {}