/**
 * PluralBuddy Discord Bot
 *  - is licensed under MIT License.
 */

import { SeqTransport } from "@datalust/winston-seq";
import { RedisAdapter } from "@slipher/redis-adapter";
import { PostHog } from "posthog-node";
import {
	ActionRow,
	type AnyContext,
	Button,
	CacheFrom,
	CheckboxGroup,
	CheckboxGroupOption,
	Client,
	Container,
	Label,
	MemoryAdapter,
	Modal,
	TextDisplay,
} from "seyfert";
import type { ContainerComponent } from "seyfert/lib/components/Container";
import type { CollectorInteraction } from "seyfert/lib/components/handler";
import type { TextDisplayComponent } from "seyfert/lib/components/TextDisplay";
import {
	ActivityType,
	ButtonStyle,
	ComponentType,
	MessageFlags,
	PresenceUpdateStatus,
} from "seyfert/lib/types";
import winston from "winston";
import { startStatisticalTimer } from "./analytics";
import api from "./api";
import { Pi18nCache } from "./cache/i18n";
import { PGuildCache } from "./cache/plural-guild";
import { SimilarWebhookResource } from "./cache/similar-webhooks";
import { StatisticResource } from "./cache/statistics";
import { ProxyResource } from "./cache/system-proxy-tags";
import TagCommand from "./commands/tag"
import {
	PluralBuddyComponentErrorCommand,
	PluralBuddyErrorCommand,
	PluralBuddyModalErrorCommand,
} from "./error-command";
import { indexingMessageMap } from "./events/on-message-create";
import { extendedContext } from "./extended-context";
import PluralBuddyHandleCommand from "./handle-command";
import { startEmojiCleanupTimer } from "./lib/clean-up-emojis";
import { startIndexingCleanupTimer } from "./lib/cleanup-indexing";
import { emojis } from "./lib/emojis";
import { getSystemFeatures } from "./lib/get-system-flags";
import { InteractionIdentifier } from "./lib/interaction-ids";
import { middlewares } from "./middleware";
import { mongoClient, setupDatabases, setupMongoDB } from "./mongodb";
import { defaultPrefixes, getGuildFromId } from "./types/guild";

export const logger = null;

if (logger) logger.info("PluralBuddy is online");

export const build = `26.1.2/${process.env.SOURCE_COMMIT?.slice(0, 7)}`;
const globalMiddlewares: readonly (keyof typeof middlewares)[] = [
	"latency",
	"noWebhookMiddleware",
	"globalBlockUserMiddleware",
	"serverBlock",
];


export const policyModal = async (
	ctx: AnyContext | CollectorInteraction,
	nextPage: string,
) =>
	new Modal()
		.setTitle(
			("userTranslations" in ctx
				? await ctx.userTranslations()
				: client.t("en").get()
			).POLICY_MODAL_TITLE,
		)
		.setCustomId(InteractionIdentifier.PolicyForm.create(nextPage))
		.setComponents([
			new TextDisplay().setContent(
				("userTranslations" in ctx
					? await ctx.userTranslations()
					: client.t("en").get()
				).POLICY_MODAL_DESCRIPTION,
			),
			new Label()
				.setLabel(
					("userTranslations" in ctx
						? await ctx.userTranslations()
						: client.t("en").get()
					).POLICY_MODAL_CONFIRMATION,
				)
				.setComponent(
					new CheckboxGroup()
						.setRequired(true)
						.setCustomId(InteractionIdentifier.PolicyFormAcceptance.create())
						.setSelectionLimit({ max: 2, min: 2 })
						.setOptions([
							new CheckboxGroupOption({
								value: "acceptance",
								label: ("userTranslations" in ctx
									? await ctx.userTranslations()
									: client.t("en").get()
								).POLICY_MODAL_DETAIL,
							}),
							new CheckboxGroupOption({
								value: "block-acceptance",
								label: ("userTranslations" in ctx
									? await ctx.userTranslations()
									: client.t("en").get()
								).POLICY_MODAL_BLOCK_DETAIL,
								description: ("userTranslations" in ctx
									? await ctx.userTranslations()
									: client.t("en").get()
								).POLICY_MODAL_BLOCK_DESC,
							}),
						]),
				),
		]);

process.on("unhandledRejection", async (reason, promise) => {
	logger?.error("Unhandled rejection, can continue");
	logger?.error(`Reason: {reason}, Promise: {promise}`, {
		reason,
		promise,
	});
});

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
			if (msg.guildId === undefined || !import.meta.main)
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
			allowed_mentions: { replied_user: false },
		}),
		defaults: new PluralBuddyErrorCommand(),
	},
	components: { defaults: new PluralBuddyComponentErrorCommand() },
	modals: { defaults: new PluralBuddyModalErrorCommand() },
	context: extendedContext,
	globalMiddlewares,
});

if (import.meta.main) {
	if (logger)
		logger.info(
			"The loaded branch is {branch}; loading PluralBuddy with default prefix(es) {prefix}",
			{
				branch: process.env.BRANCH ?? "unknown",
				prefix:
					defaultPrefixes[
						(process.env.BRANCH as "production" | "canary") ?? "production"
					],
			},
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


	(logger ?? console).info("MongoDB is loaded.");

	client.cache.statistic = new StatisticResource(client.cache, client);
	client.cache.alterProxy = new ProxyResource(client.cache, client);
	client.cache.pguild = new PGuildCache(client.cache, client);
	client.cache.similarWebhookResource = new SimilarWebhookResource(
		client.cache,
		client,
	);
	client.cache.i18n = new Pi18nCache(client.cache, client);

	if (logger) logger.info("Created cache");

	await client.start({ token: process.env.BOT_TOKEN });

	try {
		await client.uploadCommands();
	} catch (e) {
		(logger ?? console).warn(e);
		// uploading commands has an extremely low ratelimit.
	}

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

	// globalThis.getSystemFeatures = getSystemFeatures

	setInterval(async () => {
		const data = await client.cache.statistic.get("latest");

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
	}, 10000);

	startIndexingCleanupTimer();
	startEmojiCleanupTimer();
	startStatisticalTimer();
}

export async function startTesting() {
	await client.start({ token: process.env.BOT_TOKEN });
	client.gateway.setPresence({
		activities: [
			{
				name: "PluralBuddy",
				type: ActivityType.Custom,
				state: `I'm being tested right now ^_^ I'll be back soon.`,
			},
		],
		status: PresenceUpdateStatus.DoNotDisturb,
		since: Date.now(),
		afk: false,
	});
}

// API
export type { ClientType } from "./api-types";
export default api;
