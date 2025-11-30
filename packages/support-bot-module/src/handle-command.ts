/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { HandleCommand } from "seyfert/lib/commands/handle";
import { Yuna } from "yunaforseyfert";

export default class SupportBuddyHandleCommand extends HandleCommand {
    override argsParser = Yuna.parser({
        useRepliedUserAsAnOption: { requirePing: false }
    });
}
