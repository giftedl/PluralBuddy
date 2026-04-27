/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PAutoProxyObj, type PAutoProxy } from "./auto-proxy";

type Protected = { protected: true };

const publicDescription = `This is a bitwise operation-based number which determines the protection flags that are public. By default, everything on PluralBuddy is private.

| Public Flag     | Value                   | Description |
|-----------------|-------------------------|-------------|
| NAME            | \`1\` \`(1 << 0)\`      | Allows external users to see system name. |
| DISPLAY_TAG     | \`2\` \`(1 << 1)\`      | Allows external users to see system display tag. |
| DESCRIPTION     | \`4\` \`(1 << 2)\`      | Allows external users to see system description. |
| AVATAR          | \`8\` \`(1 << 3)\`      | Allows external users to see system avatar. |
| BANNER          | \`16\` \`(1 << 4)\`     | Allows external users to see system banner. |
| PRONOUNS        | \`32\` \`(1 << 5)\`     | Allows external users to see system pronouns. |
| ALTERS          | \`64\` \`(1 << 6)\`     | Allows external users to see alters inside of the system. |
| TAGS            | \`128\` \`(1 << 7)\`    | Allows external users to see tags inside of the system. |`;

const tagMapDescription = `This is a map that shows the association between a Discord server ID and a custom display tag.

\`\`\`js
{ 
  "1444187699924963350": "string"
}
\`\`\``;

export enum SystemProtectionFlags {
	NAME = 1 << 0,
	DISPLAY_TAG = 1 << 1,
	DESCRIPTION = 1 << 2,
	AVATAR = 1 << 3,
	BANNER = 1 << 4,
	PRONOUNS = 1 << 5,
	ALTERS = 1 << 6,
	TAGS = 1 << 7,
}

export const PSystemObject = z.object({
	associatedUserId: z.string(),

	systemName: z.string().max(100).min(1),
	systemDisplayTag: z.string().optional(),
	displayTagMap: z
		.record(z.string(), z.string())
		.default({})
		.meta({
			description: tagMapDescription,
			example: {
				"1444187699924963350": "string",
			},
		}),
	systemDescription: z.string().max(1000).optional(),
	systemAvatar: z.string().optional().nullable(),
	systemBanner: z.string().optional().nullable(),
	systemPronouns: z.string().optional().nullable(),

	nicknameFormat: z.string().optional(),

	alterIds: z.array(z.number()).max(2000).default([]),
	tagIds: z.array(z.string()).max(500).default([]),
	createdAt: z.coerce.date(),

	systemAutoproxy: z.array(PAutoProxyObj),
	systemOperationDM: z.boolean().default(true),

	latchExpiration: z.number().min(0).max(36000000).optional(),

	public: z.number().nonnegative().meta({ description: publicDescription }),
	/** WIP */
	subAccounts: z.array(z.string()),
	disabled: z.boolean().default(false),
});

export type PSystem = z.infer<typeof PSystemObject>;
