/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Command, AutoLoad, Declare, CommandContext } from "seyfert";

@Declare({
	name: "blacklist",
	description: "blacklist command",
    contexts: ["Guild"],
    guildId: ["1444187699924963350"]
})
@AutoLoad()
export default class BlacklistCommand extends Command {}