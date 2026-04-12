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
})

export type PExpressApplication = z.infer<typeof PExpressApplication>;