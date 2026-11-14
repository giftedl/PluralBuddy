/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { Command, AutoLoad, Declare, CommandContext } from "seyfert";

@Declare({
  name: "blocks",
  description: "block command",
  contexts: ["Guild"],
  guildId: ["1444187699924963350"],
})
@AutoLoad()
export default class BlockCommand extends Command {}
