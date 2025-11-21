/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export enum TagProtectionFlags {
    NAME          = 1 << 0,
    DESCRIPTION   = 1 << 1,
    ALTERS        = 1 << 5,
    COLOR         = 1 << 6
}

export const tagColors = [
    'red',     'orange', 'amber',
    'yellow',  'lime',   'green',
    'emerald', 'teal',   'cyan',
    'sky',     'blue',   'indigo',
    'violet',  'purple', 'fuchsia',
    'pink',    'rose'
  ]

export const PTagObject = z.object({
    tagId: z.string(),

    tagFriendlyName: z.string().max(100),
    tagDescription: z.string().optional(),
    tagColor: z.enum(tagColors),

    associatedAlters: z.string().array(),

    /** @see {@link TagProtectionFlags} */
    disallowed: z.number(),
    allowed: z.number()
})

export type PTag = z.infer<typeof PTagObject>