/**
 * PluralBuddy Discord Bot
 *  - is licensed under MIT License.
 */

import {
	ActionRow,
	Button,
	CacheFrom,
	Client,
	Container,
	MemoryAdapter,
} from "seyfert";
import { setupDatabases, setupMongoDB } from "./mongodb";
import { defaultPrefixes, getGuildFromId } from "./types/guild";
import { ActivityType, ButtonStyle, ComponentType, MessageFlags, PresenceUpdateStatus } from "seyfert/lib/types";
import { middlewares } from "./middleware";
import PluralBuddyHandleCommand from "./handle-command";
import { PostHog } from "posthog-node";
import { StatisticResource } from "./cache/statistics";
import { RedisAdapter } from "@slipher/redis-adapter";
import {
	PluralBuddyComponentErrorCommand,
	PluralBuddyErrorCommand,
	PluralBuddyModalErrorCommand,
} from "./error-command";
import { extendedContext } from "./extended-context";
import { ProxyResource } from "./cache/system-proxy-tags";
import { PGuildCache } from "./cache/plural-guild";
import { SimilarWebhookResource } from "./cache/similar-webhooks";
import api from "./api";
import { indexingMessageMap } from "./events/on-message-create";
import type { ContainerComponent } from "seyfert/lib/components/Container";
import type { TextDisplayComponent } from "seyfert/lib/components/TextDisplay";
import { startStatisticalTimer } from "./analytics";
import { startIndexingCleanupTimer } from "./lib/cleanup-indexing";
import { emojis } from "./lib/emojis";
import { Pi18nCache } from "./cache/i18n";
import { startEmojiCleanupTimer } from "./lib/clean-up-emojis";

export const buildNumber = 2789;
const globalMiddlewares: readonly (keyof typeof middlewares)[] = [
	"latency",
	"noWebhookMiddleware",
	"blacklistUserMiddleware",
	"serverBlacklist",
];

export const posthogClient =
	process.env.POSTHOG_API_KEY === undefined
		? null
		: new PostHog(process.env.POSTHOG_API_KEY ?? "", {
				host: "https://us.i.posthog.com",
				enableExceptionAutocapture: true,
			});

export const client = new Client({
	commands: {
		prefix: async (msg) => {
			if (msg.guildId === undefined)
				return defaultPrefixes[
					(process.env.BRANCH as "production" | "canary") ?? "production"
				];

			const guild = await getGuildFromId(msg.guildId ?? "");

			return guild.prefixes ?? [];
		},
		reply: (ctx) => true,
		deferReplyResponse: (ctx) => ({
			components: [
				new ActionRow().setComponents(
					new Button()
						.setCustomId("loading")
						.setEmoji(emojis.loading)
						.setStyle(ButtonStyle.Secondary),
				),
			],
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			allowed_mentions: { replied_user: false }
		}),
		defaults: new PluralBuddyErrorCommand(),
	},
	components: { defaults: new PluralBuddyComponentErrorCommand() },
	modals: { defaults: new PluralBuddyModalErrorCommand() },
	context: extendedContext,
	globalMiddlewares,
});

client.logger.info(
	"the branch is:",
	process.env.BRANCH ?? "unknown",
	"- so, default prefixes are:",
	defaultPrefixes[
		(process.env.BRANCH as "production" | "canary") ?? "production"
	],
);

client.setServices({
	middlewares: middlewares,
	handleCommand: PluralBuddyHandleCommand,
	cache: {
		disabledCache: { messages: true },
		adapter:
			process.env.REDIS === undefined
				? new MemoryAdapter()
				: new RedisAdapter({ redisOptions: { url: process.env.REDIS } }),
	},
	langs: { default: "en" },
});

await setupMongoDB();
await setupDatabases();

client.cache.statistic = new StatisticResource(client.cache, client);
client.cache.alterProxy = new ProxyResource(client.cache, client);
client.cache.pguild = new PGuildCache(client.cache, client);
client.cache.similarWebhookResource = new SimilarWebhookResource(
	client.cache,
	client,
);
client.cache.i18n = new Pi18nCache(client.cache, client);

await client.start();
await client.uploadCommands({ cachePath: "./commands.json" });

client.gateway.setPresence({
	activities: [
		{
			name: "PluralBuddy",
			type: ActivityType.Custom,
			state: `Waiting...`,
		},
	],
	status: PresenceUpdateStatus.DoNotDisturb,
	since: Date.now(),
	afk: false,
});

setTimeout(() => {
	const data = client.cache.statistic.get("latest");

	
client.gateway.setPresence({
	activities: [
		{
			name: "PluralBuddy",
			type: ActivityType.Custom,
			state: `pb;help · pb.giftedly.dev · servers: ${data?.guildCount} · proxying: ${data?.userCount}`,
		},
	],
	status: PresenceUpdateStatus.DoNotDisturb,
	since: Date.now(),
	afk: false,
});
}, 10000)

startIndexingCleanupTimer();
startEmojiCleanupTimer();
startStatisticalTimer();

// API
export type { ClientType } from "./api-types";
export default api;
