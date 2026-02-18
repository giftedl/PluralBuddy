/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";

export const Tupper = z.object({
	id: z.number(),
	name: z.string(),
	brackets: z.string().array(),
	avatar_url: z.string(),
	avatar: z.string().nullable(),
	banner: z.string().nullable(),
	posts: z.number(),
	show_brackets: z.boolean(),
	birthday: z.string().nullable(),
	description: z.string().nullable(),
	tag: z.string().nullable(),
	nick: z.string().nullable(),
	created_at: z.coerce.date(),
	group_id: z.number().nullable(),
	last_used: z.coerce.date().nullable(),
});
