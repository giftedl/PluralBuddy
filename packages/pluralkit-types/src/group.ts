/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import z from "zod";
import { PrivacyLevel } from "./privacy";

export const PluralKitGroup = z.object({
	id: z.string(),
	uuid: z.string(),
	name: z.string().max(100),
	display_name: z.string().max(100).nullable(),
	description: z.string().max(1000).nullable(),
	icon: z.string().nullable(),
	banner: z.string().nullable(),
	color: z
		.string()
		.regex(/^#?[0-9a-fA-F]{6}$/, {
			message: "Color must be a valid 6-digit RGB hex (with optional # prefix)",
		})
		.nullable(),
	created: z.coerce.date(),
	members: z.string().array(),
	privacy: z.object({
		name_privacy: PrivacyLevel,
		description_privacy: PrivacyLevel,
		banner_privacy: PrivacyLevel,
		icon_privacy: PrivacyLevel,
		list_privacy: PrivacyLevel,
		metadata_privacy: PrivacyLevel,
		visibility: PrivacyLevel,
	}),
});
