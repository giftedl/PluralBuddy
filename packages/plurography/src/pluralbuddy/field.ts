import z from "zod";

export const PField = z.object({
    id: z.string(),
    value: z.string(),
    integration: z.object({
        id: z.string(),
        name: z.string(),
        icon: z.string().optional(),
    }).optional()
})