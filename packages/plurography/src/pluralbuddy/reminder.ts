import { z } from "zod";


export const MessageDescription = z.object({
    type: z.literal("message"),
    location: z.object({
        messageId: z.string(),
        channelId: z.string(),
        guildId: z.string()
    })
})

export const TextDescription = z.object({
    type: z.literal("text"),
    contents: z.string()
})

export const PossibleDescription = MessageDescription.or(TextDescription)

export const When = z.object({
    timeMs: z.string().nullable(),
    whenAlterFronts: z.string().nullable(),
    frontingDefinedAs: z.enum(["any-ai-ap", "via-autoproxy"]).nullable()
})

export const PReminder = z.object({
    id: z.string(),
    authorId: z.string(),
    description: PossibleDescription.array(),
    when: When
})

export type PReminder = z.infer<typeof PReminder>;