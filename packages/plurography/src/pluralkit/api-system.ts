import z from "zod";
import { PrivacyLevel } from "./privacy";

export const PluralKitAPISystem = z.object({
	id: z.string(),
	uuid: z.uuid(),
	name: z.string().max(100).nullable(),
	description: z.string().max(1000).nullable(),
	tag: z.string().max(79).nullable(),
	avatar_url: z.string().nullable(),
	pronouns: z.string().max(100).nullable(),
	banner: z.string().nullable(),
	color: z
		.string()
		.regex(/^#?[0-9a-fA-F]{6}$/, {
			message: "Color must be a valid 6-digit RGB hex (with optional # prefix)",
		})
		.nullable(),
	privacy: z.object({
		name_privacy: PrivacyLevel,
		avatar_privacy: PrivacyLevel,
		description_privacy: PrivacyLevel,
		banner_privacy: PrivacyLevel,
		pronoun_privacy: PrivacyLevel,
		member_list_privacy: PrivacyLevel,
		group_list_privacy: PrivacyLevel,
		front_privacy: PrivacyLevel,
		front_history_privacy: PrivacyLevel,
	}),
	created: z.coerce.date(),
});
