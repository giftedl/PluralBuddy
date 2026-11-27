import z from "zod";

export const OurcanaSystemProperties = z.object({
	username: z.string().nullable().optional(),
	desc: z.string().nullable().optional(),
	avatarUrl: z.string().nullable().optional(),
	ourcanaSystemId: z.string().optional(),
});
