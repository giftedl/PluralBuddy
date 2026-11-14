/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import { HandleCommand } from "seyfert/lib/commands/handle";
import { Yuna } from "yunaforseyfert";

export default class SupportBuddyHandleCommand extends HandleCommand {
  override argsParser = Yuna.parser({
    useRepliedUserAsAnOption: { requirePing: false },
  });
}
