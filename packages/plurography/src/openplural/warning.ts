import z from "zod";

export const OpenPluralWarning = z.object({
    level: z.enum(["info", "warning", "error"]),
    code: z.string(),
    record_type: z.string().nullable(),
    record_id: z.uuid().nullable(),
    message: z.string(),
    count: z.number().nullable()
})