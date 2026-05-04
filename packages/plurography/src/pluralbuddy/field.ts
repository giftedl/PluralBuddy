import z from "zod";

export const PField = z.object({
    id: z.string(),
    value: z.string().max(200),
    type: z.enum([ "boolean", "string", "number", "date" ]),
    integration: z.object({
        id: z.string(),
        name: z.string(),
        icon: z.string().optional(),
    }).optional()
})