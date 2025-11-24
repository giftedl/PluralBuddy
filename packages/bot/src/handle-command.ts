/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { CommandContext, OnOptionsReturnObject } from "seyfert";
import { HandleCommand } from "seyfert/lib/commands/handle";
import { Yuna } from "yunaforseyfert";
import { AlertView } from "./views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { posthogClient } from ".";

export default class PluralBuddyHandleCommand extends HandleCommand {
    override argsParser = Yuna.parser();

}
