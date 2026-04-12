/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export const PMessageObject = z.object({
	messageId: z.string().meta({ examples: ["1481859770611666944"] }),
	systemId: z.string().meta({ examples: ["1481859816656736257"] }),
	alterId: z.number().meta({ examples: ["1481859842262962178"] }),
	createdAt: z.date(),
	guildId: z.string().optional().meta({ examples: ["1481859908541353987"] }),
	channelId: z.string().meta({ examples: ["1481859951688159236"] }),
	referencedMessage: z.string().optional(),
});

export type PMessage = z.infer<typeof PMessageObject>;
