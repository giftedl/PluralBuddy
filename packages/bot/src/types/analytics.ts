import z from "zod";

export const PAnalytics = z.object({
    alterCount: z.number(),
    messageCount: z.number(),
    guildCount: z.number(),
    configuredGuildCount: z.number(),
    totalMemberCount: z.number(),
    shardCount: z.number(),
    systemCount: z.number(),
    channelCount: z.number(),
    tagCount: z.number(),
    discordApiLatency: z.number(),
    date: z.coerce.date(),
})

export type PAnalytics = z.infer<typeof PAnalytics>;