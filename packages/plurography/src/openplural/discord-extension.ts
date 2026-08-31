import z from "zod";

export const DiscordOpenPluralExtension = z.object({ user_id: z.string(), disabled_guilds: z.array(z.string()) }).optional().nullable()