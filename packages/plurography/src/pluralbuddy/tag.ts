/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export enum TagProtectionFlags {
	NAME = 1 << 0,
	DESCRIPTION = 1 << 1,
	ALTERS = 1 << 5,
	COLOR = 1 << 6,
}

export const tagColors = [
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
];
export const tagHexColors = [
	"FF989A",
	"FFB067",
	"FFCC42",
	"FFDB3E",
	"A8F159",
	"51EFA2",
	"21E6AE",
	"00E9CF",
	"00E6FA",
	"51CEFE",
	"78BEFF",
	"96AAFF",
	"BFABFF",
	"DAA9FF",
	"FB9EFD",
	"FF9BCE",
	"FF97A5",
];

export const PTagObject = z.object({
	tagId: z.string(),
	systemId: z.string(),

	tagFriendlyName: z.string().max(100),
	tagDescription: z.string().max(1000).optional().catch(undefined),
	tagColor: z.enum(tagColors),

	associatedAlters: z.string().array(),

	/** @see {@link TagProtectionFlags} */
	public: z.number(),
});

export type PTag = z.infer<typeof PTagObject>;
