/**
 * PluralBuddy Discord Bot
 *  - is licensed under MIT License.
 */

import { CacheFrom, Client, MemoryAdapter } from "seyfert";
import { setupDatabases, setupMongoDB } from "./mongodb";
import { defaultPrefixes, getGuildFromId } from "./types/guild";
import { MessageFlags } from "seyfert/lib/types";
import { middlewares } from "./middleware";
import PluralBuddyHandleCommand from "./handle-command";
import { LoadingView } from "./views/loading";
import { PostHog } from "posthog-node";
import { StatisticResource } from "./cache/statistics";
import { RedisAdapter } from "@slipher/redis-adapter";
import {
	PluralBuddyComponentErrorCommand,
	PluralBuddyErrorCommand,
	PluralBuddyModalErrorCommand,
} from "./error-command";
import { extendedContext } from "./extended-context";

export const buildNumber = 329;
const globalMiddlewares: readonly (keyof typeof middlewares)[] = [
	"noWebhookMiddleware",
	"blacklistUserMiddleware"
];

export const posthogClient =
	process.env.POSTHOG_API_KEY === undefined
		? null
		: new PostHog(process.env.POSTHOG_API_KEY ?? "", {
				host: "https://us.i.posthog.com",
				enableExceptionAutocapture: true,
			});

console.log(
	"the branch is:",
	process.env.BRANCH ?? "unknown",
	"- so, default prefixes are:",
	defaultPrefixes[
		(process.env.BRANCH as "production" | "canary") ?? "production"
	],
);

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
			components: new LoadingView(ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		}),
		defaults: new PluralBuddyErrorCommand(),
	},
	components: { defaults: new PluralBuddyComponentErrorCommand() },
	modals: { defaults: new PluralBuddyModalErrorCommand() },
	context: extendedContext,
	globalMiddlewares,
});

client.setServices({
	middlewares: middlewares,
	handleCommand: PluralBuddyHandleCommand,
	cache: {
		adapter:
			process.env.REDIS === undefined
				? new MemoryAdapter()
				: new RedisAdapter({ redisOptions: { url: process.env.REDIS } }),
	},
});

await setupMongoDB();
await setupDatabases();
await client.start();
await client.uploadCommands({ cachePath: "./commands.json" });

client.cache.statistic = new StatisticResource(client.cache, client);

const guildCount = (await client.guilds.list()).length;
const guilds = (await client.guilds.list()) ?? [];
let userCount = 0;
for (const unfetchedGuild of guilds.values()) {
	const guild = await unfetchedGuild.fetch();

	if (guild.members) {
		userCount += guild.memberCount ?? 0;
	}
}

client.cache.statistic.set(CacheFrom.Rest, "latest", { guildCount, userCount });

Bun.serve({
	port: 3000,
	routes: {
		"/api/stats": (req) => {
			if (req.headers.get("X-PluralBuddy-Api-Key") !== process.env.API_KEY)
				return Response.json({ error: "invalid key" }, { status: 400 })

			return Response.json(client.cache.statistic.get("latest"));
		},
	},
	fetch(req, server) {
		return Response.error()
	},
});
