import z from "zod";

export const OurcanaNode = z.object({
	id: z.string(),
	type: z.string(),
	properties: z.record(z.string(), z.unknown()),
});

export const OurcanaExport = z.object({
	format: z.literal("ourcana"),
	version: z.number().int().positive(),
	exportedAt: z.coerce.date().optional(),
	graph: z.object({
		nodes: OurcanaNode.array(),
		edges: z.unknown().array().default([]),
	}),
});
