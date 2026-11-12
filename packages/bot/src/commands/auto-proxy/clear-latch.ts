/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { runClearLatch } from "@/lib/ap-cmds/clear-latch";
import { userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { type CommandContext, Declare, IgnoreCommand, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
  name: "clear-latch",
  description: "Clear latch data from auto-proxy.",
  aliases: ["cl"],
  contexts: ["Guild"],
  ignore: IgnoreCommand.Message,
})
export default class ClearLatchAutoProxy extends SubCommand {
  override async run(ctx: CommandContext) {
    return await runClearLatch(ctx);
  }
}
