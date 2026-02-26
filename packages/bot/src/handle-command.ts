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

	override resolveCommandFromContent = Yuna.resolver({
		/**
		 * You need to pass the client in order to prepare the commands that the resolver will use.
		 */
		client: this.client,
		/**
		 * Event to be emitted each time the commands are prepared.
		 */
		afterPrepare: (metadata) => {
			this.client.logger.debug(
				`Ready to use ${metadata.commands.length} commands !`,
			);
		},
	});
}
