/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import z from "zod";

const publicDescription = `This is a bitwise operation-based number which determines the protection flags that are public. By default, everything on PluralBuddy is private.

| Public Flag     | Value                   | Description |
|-----------------|-------------------------|-------------|
| NAME            | \`1\` \`(1 << 0)\`      | Allows external users to see the tag's name. |
| DESCRIPTION     | \`2\` \`(1 << 1)\`      | Allows external users to see the tag's description. |
| ALTERS          | \`32\` \`(1 << 5)\`     | Allows external users to see the tag's associated alters. |
| COLOR           | \`64\` \`(1 << 6)\`     | Allows external users to see the tag's banner. |`;

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

export const PTagObject = z
  .object({
    tagId: z.string(),
    systemId: z.string(),

    tagFriendlyName: z.string().max(100),
    tagDescription: z.string().max(1000).optional().nullable(),
    tagColor: z.enum(tagColors),

    associatedAlters: z.string().array(),
    orderString: z.string().max(4).min(1).optional(),

    /** @see {@link TagProtectionFlags} */
    public: z.number().nonnegative().meta({ description: publicDescription, example: 0 }),
    fields: z.record(z.string().max(20), z.string().max(150)).optional().default({}),
  })
  .meta({ id: "PTag" });

export type PTag = z.infer<typeof PTagObject>;
