/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { createMiddleware } from "seyfert";
import { posthogClient } from "..";
import { DiscordSnowflake } from "@sapphire/snowflake";

export const posthogInteractionMiddleware = createMiddleware<void>((middle) => {
	if (posthogClient)
		posthogClient.capture({
			distinctId: middle.context.author.id,
			event: "interaction",

			properties: {
				$set: { username: middle.context.author.username },

				interactionId: (
					middle.context.interaction ?? { id: `c${DiscordSnowflake.generate()}` }
				).id,
				guildId: middle.context.guildId,
				channelId: middle.context.channelId,
			},
		});

	return middle.next();
});
