import { errorCollection, guildCollection } from "@/mongodb";
import { DiscordSnowflake } from "@sapphire/snowflake";
import type { GuildErrorTypes } from "plurography";
import type { Guild } from "seyfert";
import type z from "zod";

export async function createError(
	guildId: string,
	opts: {
		title: string;
		description: string;
		type: z.infer<typeof GuildErrorTypes>;

		responsibleUserId?: string;
		responsibleChannelId?: string;
	},
) {
	const guildErrorId = DiscordSnowflake.generate().toString();

	await errorCollection.insertOne({
		id: guildErrorId,
		responsibleGuildId: guildId,
		createdAt: new Date(),
		...opts,
	});

	await guildCollection.updateOne(
		{ guildId },
		{ $push: { errorLog: { ...opts, id: guildErrorId, timestamp: new Date() } } },
	);

    return {guildErrorId, ...opts};
}
