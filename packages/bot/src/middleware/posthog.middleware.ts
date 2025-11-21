/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { createMiddleware } from "seyfert";
import { posthogClient } from "..";

export const posthogInteractionMiddleware = createMiddleware<void>((middle) => {
	posthogClient.capture({
		distinctId: middle.context.author.id,
		event: "interaction",

		properties: {
			$set: { username: middle.context.author.username },
            
            interactionId: middle.context.interaction.id,
            guildId:       middle.context.guildId,
            channelId:     middle.context.channelId,
        }
	});

	return middle.next();
});
