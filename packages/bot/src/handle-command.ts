/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { HandleCommand } from "seyfert/lib/commands/handle";
import { Yuna } from "yunaforseyfert";

export default class PluralBuddyHandleCommand extends HandleCommand {
    override argsParser = Yuna.parser();
}
