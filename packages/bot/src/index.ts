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

export const buildNumber = 203;
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

export const extendedContext = extendContext((interaction) => {
	const ephemeral = async (
		body: InteractionCreateBodyRequest,
		allowedPublic?: boolean,
	) => {
		if (interaction instanceof Message) {
			if (
				allowedPublic &&
				(interaction.content.endsWith("-p") ||
					interaction.content.endsWith("-public"))
			) {
				return await interaction.reply(body);
			}

			const message = await interaction.reply(
				{
					components: [
						new ActionRow().setComponents(
							new Button()
								.setEmoji(emojis.folderKeyWhite)
								.setStyle(ButtonStyle.Primary)
								.setCustomId(`ephemeral-${interaction.id}`),
						),
					],
				},
				true,
			);

			const collector = message.createComponentCollector();

			collector.run(`ephemeral-${interaction.id}`, async (i) => {
				if (i.user.id !== interaction.user.id)
					return i.write({
						components: [
							new Container().setComponents(
								new TextDisplay().setContent(
									"You are not the original recipient of the message.",
								),
							),
						],
						flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					});

				if (i.isButton()) {
					message.delete();
					return i.write(body);
				}
			});

			return message;
		}
		return await interaction.write(body);
	};

	return {
		ephemeral,
		retrievePUser: async () => getUserById(interaction.user.id),
		retrievePGuild: async () => getGuildFromId(interaction.guildId ?? "??"),
		userTranslations: () => translations,
		loading: (translations: TranslationString) => {
			return {
				components: new LoadingView(translations).loadingView(),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			};
		},
		loadingEphemeral: (translations: TranslationString) => {
			return ephemeral({
				components: new LoadingView(translations).loadingView(),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		},
		getDefaultPrefix: async () => {
			if (interaction.guildId) {
				return (await getGuildFromId(interaction.guildId ?? "??")).prefixes[0];
			}
			return defaultPrefixes[
				(process.env.BRANCH as "production" | "canary") ?? "production"
			][0];
		},
	};
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
	},
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
