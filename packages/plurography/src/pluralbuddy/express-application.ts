import z from "zod";

export const PExpressApplication = z.object({
    application: z.string(),
    token: z.object({
        iv: z.string(),
        value: z.string(),
    }),
    publicKey: z.string(),
    owner: z.string(),
    alterId: z.number(),
    usesContainer: z.boolean().default(false),
    profileName: z.string().default("").optional()
})

export type PExpressApplication = z.infer<typeof PExpressApplication>;