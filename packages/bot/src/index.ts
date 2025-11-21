/**
 * PluralBuddy Discord Bot
 *  - is licensed under MIT License.
 */

import {
	ActionRow,
	Button,
	Cache,
	CacheFrom,
	Client,
	Container,
	Emoji,
	extendContext,
	MemoryAdapter,
	Message,
	TextDisplay,
} from "seyfert";
import { setupDatabases, setupMongoDB } from "./mongodb";
import { defaultPrefixes, getGuildFromId } from "./types/guild";
import type { InteractionCreateBodyRequest } from "seyfert/lib/common";
import { Emojis } from "seyfert/lib/cache/resources/emojis";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { noWebhookMiddleware } from "./middleware/no-webhook.middleware";
import { middlewares } from "./middleware";
import { getUserById } from "./types/user";
import { translations } from "./lang/en_us";
import { emojis } from "./lib/emojis";
import PluralBuddyHandleCommand from "./handle-command";
import { LoadingView } from "./views/loading";
import type { TranslationString } from "./lang";
import { PostHog } from "posthog-node";
import { StatisticResource } from "./cache/statistics";
import { RedisAdapter } from "@slipher/redis-adapter";
import { PluralBuddyComponentErrorCommand, PluralBuddyErrorCommand, PluralBuddyModalErrorCommand } from "./error-command";
import { PluralBuddyErrorModalCommandImpl } from "./error-command-impl";
import { extendedContext } from "./extended-context";

export const buildNumber = 209;
const globalMiddlewares: readonly (keyof typeof middlewares)[] = [
	"noWebhookMiddleware",
	"blacklistUserMiddleware",
	"posthogInteractionMiddleware",
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
        defaults: new PluralBuddyErrorCommand()
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
