import { collectDefaultMetrics, Gauge, Summary } from "@prometheus-io/client";
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

collectDefaultMetrics();

const countedAlters = new Gauge({
	name: "pluralbuddy_counted_alters",
	help: "Total number of PluralBuddy alters.",
	async collect() {
		const alters = await alterCollection.countDocuments();
		this.set(alters);
	},
});
const countedServers = new Gauge({
	name: "pluralbuddy_counted_guilds",
	help: "Total number of servers PluralBuddy is in.",
	async collect() {
		this.set((await client.cache.guilds?.count()) ?? 3);
	},
});
const countedMessages = new Gauge({
	name: "pluralbuddy_counted_messages",
	help: "Total number of messages PluralBuddy stores.",
	async collect() {
		const messages = await messagesCollection.countDocuments();
		this.set(messages);
	},
});
const configuredGuildCount = new Gauge({
	name: "pluralbuddy_counted_mongo_configured_guilds",
	help: "Total amount of counted, Mongo-adjacent, possibly-configured guilds.",
	async collect() {
		const configuredGuilds = await guildCollection.countDocuments();
		this.set(configuredGuilds);
	}
})
const systemCount = new Gauge({
	name: "pluralbuddy_counted_systems",
	help: "Total amount of systems in PluralBuddy.",
	async collect() {
		const systems = await userCollection.countDocuments();
		this.set(systems);
	}
})
const totalShards = new Gauge({
	name: "pluralbuddy_counted_total_shards",
	help: "Total amount of shards running in the gateway.",
	async collect() {
		this.set(client.gateway.totalShards);
	}
})
const totalTags = new Gauge({
	name: "pluralbuddy_counted_total_tags",
	help: "Total amount of tags in the database.",
	async collect() {
		const tags = await tagCollection.countDocuments();
		this.set(tags)
	}
})
export const discordApiLatency = new Summary({
	name: "pluralbuddy_observed_discord_latency",
	help: "Observed amount of latency from Discord.",
})

export async function gatherStatisticalData() {
	await client.cache.statistic.set(CacheFrom.Gateway, "latest", {
		guildCount: (await client.cache.guilds?.count()) ?? 3,
		userCount: 0,
	});
}

export function startStatisticalTimer() {
	(async () => {
		await gatherStatisticalData();
	})();

	setInterval(
		async () => {
			await gatherStatisticalData();
		},
		1000 * 60 * 5,
	);
}
