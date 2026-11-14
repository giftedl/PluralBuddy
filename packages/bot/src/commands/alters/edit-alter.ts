/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { Command, AutoLoad, Declare, CommandContext } from "seyfert";

@Declare({
  name: "edit-alter",
  description: "alter command",
  aliases: ["ea", "em", "edit-member"],
  contexts: ["BotDM", "Guild"],
})
@AutoLoad()
export default class EditAlterRootCommand extends Command {}
