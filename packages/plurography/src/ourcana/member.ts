import z from "zod";

export const OurcanaMemberProperties = z.object({
	name: z.string(),
	displayName: z.string().nullable().optional(),
	pronouns: z.string().nullable().optional(),
	desc: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
	avatarUrl: z.string().nullable().optional(),
	bannerUrl: z.string().nullable().optional(),
	webhookAvatarUrl: z.string().nullable().optional(),
	proxyTags: z
		.object({
			prefix: z.string().optional(),
			suffix: z.string().optional(),
		})
		.array()
		.optional()
		.default([]),
	ourcanaId: z.string().optional(),
});
