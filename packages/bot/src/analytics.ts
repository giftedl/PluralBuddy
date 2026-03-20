import { CacheFrom } from "seyfert";
import { client } from ".";
import {
	alterCollection,
	analyticsCollection,
	guildCollection,
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

	const guildCount = (await client.guilds.list({}, true)).length;
	const guilds = (await client.guilds.list({}, true)) ?? [];

	if (latencyDataPoints.length === 0)
		// No applicable data
		latencyDataPoints.push(0);

	let userCount = 0;
	let channelCount = 0;

	console.log("1")

	for (const unfetchedGuild of guilds.values()) {
		const guild = await unfetchedGuild.fetch();
		const channels = await client.cache.channels?.values(guild.id);

		if (guild.members) {
			userCount += guild.memberCount ?? 0;
		}
		if (channels) channelCount += channels.length;
	}

	await client.cache.statistic.set(CacheFrom.Gateway, "latest", {
		guildCount,
		userCount,
	});

	console.log("2")

	return {
		alterCount: alters,
		guildCount,
		configuredGuildCount: configuredGuilds,
		systemCount: systems,
		totalMemberCount: userCount,
		discordApiLatency:
			latencyDataPoints.reduce(
				(accumulator, currentValue) => accumulator + currentValue,
				0,
			) / latencyDataPoints.length,
		date: new Date(),
		shardCount: client.gateway.totalShards,
		channelCount,
		tagCount: tags,
	};
}

export function startStatisticalTimer() {
	// Run first as a test run
	(async () => {
		await analyticsCollection.insertOne(await gatherStatisticalData());
	})();

	setInterval(
		async () => {
			await analyticsCollection.insertOne(await gatherStatisticalData());
		},
		1000 * 60 * 5,
	);
}
