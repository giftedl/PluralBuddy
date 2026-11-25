import z from "zod";

export const OurcanaGroupProperties = z.object({
	label: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	displayName: z.string().nullable().optional(),
	desc: z.string().nullable().optional(),
	color: z.string().nullable().optional(),
});
