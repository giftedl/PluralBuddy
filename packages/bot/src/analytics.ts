import { CacheFrom } from "seyfert";
import { client } from ".";
import {
	alterCollection,
	analyticsCollection,
	guildCollection,
	messagesCollection,
	tagCollection,
	userCollection,
} from "./mongodb";
import type { PAnalytics } from "./types/analytics";

export let latencyDataPoints: number[] = [];

export async function gatherStatisticalData(): Promise<PAnalytics> {
	const alters = await alterCollection.countDocuments();
	const tags = await tagCollection.countDocuments();
	const systems = await userCollection.countDocuments();
	const configuredGuilds = await guildCollection.countDocuments();
	const messages = await messagesCollection.countDocuments();

	const guilds = (await client.guilds.list({with_counts: true}, true)) ?? [];

	if (latencyDataPoints.length === 0)
		// No applicable data
		latencyDataPoints.push(0);

	let userCount = 0;
	let channelCount = 0;

	for (const guild of guilds) {
		const channels = await client.cache.channels?.values(guild.id);

		if (((guild as unknown as { approximateMemberCount: number }).approximateMemberCount)) {
			userCount += ((guild as unknown as { approximateMemberCount: number }).approximateMemberCount) ?? 0;
		}
		if (channels) channelCount += channels.length;
	}

	await client.cache.statistic.set(CacheFrom.Gateway, "latest", {
		guildCount: guilds.length,
		userCount,
	});

	const latency = latencyDataPoints.reduce(
		(accumulator, currentValue) => accumulator + currentValue,
		0,
	) / latencyDataPoints.length;
	latencyDataPoints = [];

	return {
		alterCount: alters,
		guildCount: guilds.length,
		messageCount: messages,
		configuredGuildCount: configuredGuilds,
		systemCount: systems,
		totalMemberCount: userCount,
		discordApiLatency: latency,
		date: new Date(),
		shardCount: client.gateway.totalShards,
		channelCount,
		tagCount: tags,
	};
}

export function startStatisticalTimer() {
	// Run first as a test run
	// (async () => {
	// 	await analyticsCollection.insertOne(await gatherStatisticalData());
	// })();

	setInterval(
		async () => {
			await analyticsCollection.insertOne(await gatherStatisticalData());
		},
		1000 * 60 * 5,
	);
}
