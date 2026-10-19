/**
 * PluralBuddy Discord Bot
 *  - is licensed under MIT License.
 */

import "./instrument";
import { SeqTransport } from "@datalust/winston-seq";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-proto";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import {
	ConsoleMetricExporter,
	PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
	BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-node";
import * as Sentry from "@sentry/bun";
import { RedisAdapter } from "@slipher/redis-adapter";
import { serve } from "bun";
import { PostHog } from "posthog-node";
import {
	ActionRow,
	Button,
	Client,
	definePlugins,
	LimitedCollection,
	MemoryAdapter,
} from "seyfert";
import { SeyfertError } from "seyfert/lib/common";
import {
	ActivityType,
	ButtonStyle,
	MessageFlags,
	PresenceUpdateStatus,
} from "seyfert/lib/types";
import winston from "winston";
import api from "./api";
import { Pi18nCache } from "./cache/i18n";
import { PGuildCache } from "./cache/plural-guild";
import { SimilarWebhookResource } from "./cache/similar-webhooks";
import { StatisticResource } from "./cache/statistics";
import { ProxyResource } from "./cache/system-proxy-tags";
import { PTerminologyCache } from "./cache/terminology";
import {
	PluralBuddyComponentErrorCommand,
	PluralBuddyErrorCommand,
	PluralBuddyModalErrorCommand,
} from "./error-command";
import { extendedContext } from "./extended-context";
import { startEmojiCleanupTimer } from "./lib/clean-up-emojis";
import { startIndexingCleanupTimer } from "./lib/cleanup-indexing";
import { emojis } from "./lib/emojis";
import { initializeApplicationCommands } from "./lib/mention-command";
import { middlewares } from "./middleware";
import { setupDatabases, setupMongoDB } from "./mongodb";
import { openTelemetry } from "./plugins/opentelemetry";
import { yunaForSeyfert } from "./plugins/yunaforseyfert";
import { defaultPrefixes, getGuildFromId } from "./types/guild";

export const logger = process.env.SEQ_HOST
	? winston.createLogger({
			level: "info",
			format: winston.format.combine(
				/* This is required to get errors to log with stack traces. See https://github.com/winstonjs/winston/issues/1498 */
				winston.format.errors({ stack: true }),
				winston.format.json(),
			),
			defaultMeta: { application: "pluralbuddy" },
			transports: [
				new winston.transports.Console({
					format: winston.format.simple(),
				}),
				new SeqTransport({
					serverUrl: process.env.SEQ_HOST,
					apiKey: process.env.SEQ_KEY,
					onError: (e) => {
						console.error(e);
					},
					handleExceptions: true,
					handleRejections: true,
				}),
			],
		})
	: null;

if (logger) logger.info("PluralBuddy is online");

export const build = `26.2.0/${process.env.SOURCE_COMMIT?.slice(0, 7)}`;
const globalMiddlewares: readonly (keyof typeof middlewares)[] = [
	"latency",
	"noWebhookMiddleware",
	"globalBlockUserMiddleware",
	"serverBlock",
];

process.on("unhandledRejection", async (reason, promise) => {
	logger?.error("Unhandled rejection, can continue");
	logger?.error(`Reason: {reason}, Promise: {promise}`, {
		reason,
		promise,
	});
});

export type { ClientType } from "./api-types";

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
		reply: () => true,
		deferReplyResponse: () => ({
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
	plugins: definePlugins(yunaForSeyfert(), openTelemetry()),
	components: { defaults: new PluralBuddyComponentErrorCommand() },
	modals: { defaults: new PluralBuddyModalErrorCommand() },
	context: extendedContext,
	globalMiddlewares,
});


if (import.meta.main) {
	const server = serve(api);
	console.log(`http server listening on :${server.port}`);
	// @ts-expect-error
	// if (logger) client.logger = {...client.logger, info: logger.info, warn: logger.warn, fatal: logger.error};

	client.logger.info(
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
		cache: {
			disabledCache: { messages: true },
			adapter:
				process.env.REDIS === undefined
					? new MemoryAdapter()
					: new RedisAdapter({ redisOptions: { url: process.env.REDIS } }),
		},
		langs: { default: "en" },
	});

	client.logger.warn(
		"Reminder: Starting MongoDB. If process hangs, make sure MongoDB is started.",
	);
	await setupMongoDB();
	await setupDatabases();

	client.logger.info("MongoDB is loaded.");

	client.cache.statistic = new StatisticResource(client.cache, client);
	client.cache.alterProxy = new ProxyResource(client.cache, client);
	client.cache.pguild = new PGuildCache(client.cache, client);
	client.cache.similarWebhookResource = new SimilarWebhookResource(
		client.cache,
		client,
	);
	client.cache.i18n = new Pi18nCache(client.cache, client);
	client.cache.terminology = new PTerminologyCache(client.cache, client);

	client.logger.info("Created cache");

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
					state: `🩵 pluralbuddy.app · servers: ${data?.guildCount}`,
				},
			],
			status: PresenceUpdateStatus.DoNotDisturb,
			since: Date.now(),
			afk: false,
		});
	}, 10000);

	await initializeApplicationCommands();

	startIndexingCleanupTimer();
	startEmojiCleanupTimer();
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
