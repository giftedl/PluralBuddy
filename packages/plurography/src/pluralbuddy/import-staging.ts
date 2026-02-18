import z from "zod";

export const ImportStageObject = z.object({
	webhook: z.object({
		id: z.string(),
		token: z.string(),
	}),
	response: z
		.object({
			data: z.string(),
			dataType: z.enum(["PluralKit", "TupperBox", "PluralBuddy"]),
		})
		.nullable()
		.default(null),

	originatingSystemId: z.string(),
	importMode: z.enum(["replace", "add", "full-mode", "delete"]),
	createdAt: z.coerce.date(),
});

export type ImportStage = z.infer<typeof ImportStageObject>;
