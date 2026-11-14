/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { Command, AutoLoad, Declare } from "seyfert";

@Declare({
  name: "edit-tag",
  description: "tag command",
  aliases: ["et"],
  contexts: ["BotDM", "Guild"],
})
@AutoLoad()
export default class EditTagRootCommand extends Command {}
