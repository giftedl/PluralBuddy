import z from "zod";

export const OpenPluralVisibility = z.enum(["public", "friends", "private", "trusted", "unknown"])
export const OpenPluralPrivacy = z.object({
    visibility: OpenPluralVisibility.default("unknown"),
    source: z.record(z.string(), z.unknown())
})