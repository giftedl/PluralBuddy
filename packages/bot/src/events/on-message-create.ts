/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { Double } from "mongodb";
import {
	ActionRow,
	Button,
	CacheFrom,
	Container,
	createEvent,
	type DefaultLocale,
	Message,
	type MessageStructure,
	StringSelectMenu,
	StringSelectOption,
	TextDisplay,
	WebhookMessage,
	type WebhookMessageStructure,
} from "seyfert";
import type { ResolverProps, SendResolverProps } from "seyfert/lib/common";
import {
	ButtonStyle,
	MessageFlags,
	type RESTPatchAPIWebhookWithTokenMessageJSONBody,
	type RESTPatchAPIWebhookWithTokenMessageQuery,
	type RESTPostAPIWebhookWithTokenJSONBody,
	type RESTPostAPIWebhookWithTokenQuery,
} from "seyfert/lib/types";
import { latencyDataPoints } from "@/analytics";
import { helpPages } from "@/commands/help";
import { getWiderAutoProxy } from "@/lib/autoproxy-util";
import { blockedChannel, blockedRole } from "@/lib/blocked";
import { createError } from "@/lib/create-error";
import { emojis } from "@/lib/emojis";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { getLanguageByUserId } from "@/lib/lang";
import { handleDMReply } from "@/lib/proxying/dm-replying";
import { createProxyError } from "@/lib/proxying/error";
import { performAlterAutoProxy } from "@/lib/proxying/types/alter-ap";
import {
	performTagProxy,
	proxyTagValid,
} from "@/lib/proxying/types/tag-proxying";
import {
	getSimilarWebhooks,
	isValidDm,
	notValidPermissions,
	setLastLatchAlter,
	startsWithPrefix,
} from "@/lib/proxying/util";
import { endTimer, startTimer } from "@/lib/timings";
import type { PAlter } from "@/types/alter";
import { getGuildFromId, PGuildObject } from "@/types/guild";
import { AlertView } from "@/views/alert";
import { build, client } from "..";
import { alterCollection, errorCollection, frontsCollection } from "../mongodb";
import { getUserById } from "../types/user";

export const indexingMap: Record<string, NodeJS.Timeout> = {};
export const indexingMessageMap: Record<string, Message> = {};

export type ApplicableWebhookWritePayload = {
	body: Omit<
		RESTPostAPIWebhookWithTokenJSONBody,
		"components" | "embeds" | "poll" | "content"
	> &
		SendResolverProps;
	query?: RESTPostAPIWebhookWithTokenQuery | undefined;
};
export type ApplicableWebhookEditPayload = {
	body: Omit<
		RESTPatchAPIWebhookWithTokenMessageJSONBody,
		"components" | "content" | "embeds" | "poll"
	> &
		ResolverProps;
	messageId: string;
	query?: RESTPatchAPIWebhookWithTokenMessageQuery | undefined;
};
export type PWebhook = {
	id: string;
	messages: {
		write: (
			payload: ApplicableWebhookWritePayload,
		) => Promise<WebhookMessage | null>;
		edit: (
			payload: ApplicableWebhookEditPayload,
		) => Promise<WebhookMessageStructure>;
	};
};

export default createEvent({
	data: { name: "messageCreate", once: false },
	run: async (message: Message) => {
		latencyDataPoints.push(
			Date.now() -
				// @ts-ignore
				message.createdTimestamp,
		);
		handleDMReply(message);

		if (message.author.bot === true) return;
		if (startsWithPrefix(message)) return;

		if (message.content === `<@${message.client.applicationId}>`) {
			const locale = await getLanguageByUserId(message.author.id);
			const guild = await getGuildFromId(message.guildId ?? "");

			if (guild.getFeatures().disabledHelp) {
				message.delete();

				try {
					await message.author.write({
						components: new AlertView(locale).errorView(
							"FEATURE_DISABLED_GUILD",
						),
						flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					});
				} catch (_) {}
				return;
			}

			const currentPage = helpPages[0];
			const contents = await Bun.file(`content/${currentPage?.file}`).text();

			client.logger.info("User requested help page: {contents}", { contents });

			return await message.reply({
				components: [
					new TextDisplay().setContent(
						locale.AWAKE.replace("{{ buildNumber }}", String(build)).replace(
							"{{ branch }}",
							process.env.BRANCH ?? "unknown",
						),
					),
					new ActionRow().setComponents(
						[
							{ n: locale.LINK_INVITE, l: "invite" },
							{ n: locale.LINK_SUPPORT, l: "discord" },
							{ n: locale.LINK_DOCS, l: "docs" },
						].map((c) =>
							new Button()
								.setStyle(ButtonStyle.Link)
								.setURL(`https://gftl.fyi/${c.l}`)
								.setLabel(c.n),
						),
					),
					new Container()
						.setComponents(new TextDisplay().setContent(contents))
						.setColor("#FCCEE8"),
					new Container().setComponents(
						new ActionRow().setComponents(
							new StringSelectMenu()
								.setCustomId(InteractionIdentifier.Help.Menu.create())
								.setOptions(
									helpPages.map((c) =>
										new StringSelectOption()
											.setValue(c.id)
											.setLabel(c.name)
											.setDescription(c.id)
											.setDefault(c.id === currentPage?.id),
									),
								),
						),
						new ActionRow().setComponents(
							new Button()
								.setCustomId("disabled")
								.setDisabled(true)
								.setLabel(locale.PAGINATION_PREVIOUS_PAGE)
								.setStyle(ButtonStyle.Primary),
							new Button()
								.setCustomId(
									InteractionIdentifier.Help.Page.create(
										helpPages[1] ? helpPages[1].id : "",
									),
								)
								.setDisabled(helpPages[1] === undefined)
								.setLabel(locale.PAGINATION_NEXT_PAGE)
								.setStyle(ButtonStyle.Primary),
						),
					),
				],
				flags: MessageFlags.IsComponentsV2,
			});
		}
		if (await isValidDm(message)) {
			message.reply({
				components: [
					// @ts-ignore
					...new AlertView(locale).errorView("NO_DM_CHANNELS"),
				],
				flags: MessageFlags.IsComponentsV2,
			});
			return;
		}
		if ((await message.channel()).isDM()) return;
		if (!message.member) return;

		if (await notValidPermissions(message)) return;

		const channel = await message.channel();
		const parent =
			"parentId" in channel && channel.isThread() ? channel.parentId : null;

		const similarWebhooks =
			(
				await client.cache.similarWebhookResource.fetch(
					parent ?? message.channelId,
				)
			)?.webhooks ?? (await getSimilarWebhooks(parent ?? message.channelId));
		const user = await getUserById(message.author.id);
		const guild = PGuildObject.parse(
			(await client.cache.pguild.get(message.guildId ?? ""))?.g ??
				(await getGuildFromId(message.guildId ?? "")),
		);

		if (user.system === undefined) return;
		if (user.blocked) {
			client.logger.info(`${message.id} ended because user was blocked`);
			return;
		}
		if (user.system.disabled) return;
		if ((user.system.disabledGuilds ?? []).includes(message.guildId ?? ""))
			return;
		if (!message.guildId) return;

		const apMode = getWiderAutoProxy(
			user.system,
			message.guildId,
			message.channelId,
		);

		if (apMode.autoproxyMode !== "latch" && apMode.autoproxyMode !== "off") {
			startTimer(`proxy: pre-system autoproxy (${message.id})`);

			let alter = apMode.autoproxyAlter;

			if (apMode.autoproxyMode !== "alter" && !alter) {
				// Check for AI/AP

				const fronts = await frontsCollection.findOne({
					aiapId: apMode?.autoproxyMode,
					systemId: message.author.id,
				});

				if (fronts?.alterId) {
					alter = fronts.alterId;
				}
			}

			if (message.content.startsWith("\\")) {
				return;
			}

			if (alter) {
				const fetchedAlter = await alterCollection.findOne({
					alterId: Number(alter),
					systemId: message.author.id,
				});
				if (
					message.guildId &&
					guild.getFeatures().requiresGuildTag &&
					(((user.system?.displayTagMap ?? {})[message.guildId] ??
						user.system.systemDisplayTag) === undefined ||
						((user.system?.displayTagMap ?? {})[message.guildId] ??
							user.system.systemDisplayTag) === null)
				) {
					const locale = await getLanguageByUserId(message.author.id);
					endTimer(`proxy: bruteforce proxy (${message.id})`);
					createProxyError(user, message, {
						title: locale.DISPLAY_TAG_ENFORCE,
						description: locale.DISPLAY_TAG_ENFORCE_DESC,
						type: "EnforcedGuildTagRegulation",
						setSystemTag: locale.ALTER_SET_TAG,
					});

					return;
				}

				if (fetchedAlter) {
					const locale = await getLanguageByUserId(message.author.id);

					if (!(await blockedRole(guild, locale, message))) return;
					if (!(await blockedChannel(guild, locale, message))) return;

					endTimer(`proxy: pre-system autoproxy (${message.id})`);

					performAlterAutoProxy(
						message,
						similarWebhooks,
						fetchedAlter,
						user,
						guild,
						message.member,
					);
					return;
				}
			}
		}

		if (user.system.alterIds.length === 0) return;
		if (!indexingMap[message.author.id]) {
			startTimer(`proxy: bruteforce proxy (${message.id})`);

			let indexingMessage: MessageStructure | null =
				null as MessageStructure | null;
			let eligibleToProcess = false;
			let locale: DefaultLocale | null = null;

			const indexingTimeout = setTimeout(async () => {
				if (locale === null)
					locale = await getLanguageByUserId(message.author.id);
				const channel = message.channelId;

				client.logger.warn(
					"{message} is taking too long. shoved into the processing queue ({alterCount} alters)",
					{ message: message.id, alterCount: user.system?.alterIds.length },
				);

				if (eligibleToProcess && process.env.REDIS)
					try {
						indexingMessage = await message.client.messages.write(channel, {
							components: [
								new Container()
									.setComponents(
										new TextDisplay().setContent(
											`  ${emojis.loading}   ${locale.WAITING_INDEXING.replaceAll(
												"{{ alterCount }}",
												(user.system?.alterIds.length ?? 0).toString(),
											)
												.replace("{{ alters }}", "0")
												.replace("{{ percentage }}", "0%")}`,
										),
									)
									.setColor("#5450fe"),
							],
							flags: MessageFlags.IsComponentsV2,
						});

						indexingMessageMap[message.author.id] = indexingMessage;
					} catch (_) {}
			}, 2000);
			indexingMap[message.author.id] = indexingTimeout;

			const removeFromMap = () => {
				delete indexingMap[message.author.id];
				delete indexingMessageMap[message.author.id];

				clearTimeout(indexingTimeout);
				if (indexingMessage !== null) indexingMessage.delete();
			};

			// Only find the alters that we need
			for (let i = 0; i < user.system.alterIds.length; i++) {
				const alterIdStr = user.system.alterIds[i]?.toString() ?? "";
				let proxyObject = await message.client.cache.alterProxy.get(alterIdStr);

				let reformedProxyTags: { prefix: string; suffix: string }[] = [];

				if (i % 20 === 0 && indexingMessage) {
					const locale = await getLanguageByUserId(message.author.id);

					client.logger.debug(
						"processing {message} ({alterCount} alters), {percentage}% done",
						{
							message: message.id,
							alterCount: user.system?.alterIds.length,
							percentage: `${Math.round((i / Math.round(user.system?.alterIds.length ?? 1)) * 1000) / 10}%`,
						},
					);

					await indexingMessage?.edit({
						components: [
							new Container()
								.setComponents(
									new TextDisplay().setContent(
										`  ${emojis.loading}   ${locale.WAITING_INDEXING.replaceAll(
											"{{ alterCount }}",
											(user.system?.alterIds.length ?? 0).toString(),
										)
											.replace("{{ alters }}", i.toString())
											.replace(
												"{{ percentage }}",
												`${Math.round((i / Math.round(user.system?.alterIds.length ?? 1)) * 1000) / 10}%`,
											)}`,
									),
								)
								.setColor("#5450fe"),
						],
						flags: MessageFlags.IsComponentsV2,
					});
				}

				// If cache miss or cache stale, fetch from DB and set cache
				if (!proxyObject || !proxyObject.pt) {
					const checkAlter = await alterCollection.findOne({
						alterId: Number(user.system.alterIds[i]),
					});

					if (checkAlter && Array.isArray(checkAlter.proxyTags)) {
						// Set in cache with correct structure
						await message.client.cache.alterProxy.set(
							CacheFrom.Rest,
							alterIdStr,
							{
								pt: JSON.stringify(
									checkAlter.proxyTags.map((c) => ({
										p: c.prefix,
										s: c.suffix,
									})),
								),
							},
						);
						// Now also prepare the tags for usage
						reformedProxyTags = checkAlter.proxyTags.map((c) => ({
							prefix: c.prefix,
							suffix: c.suffix,
						}));
					}
					eligibleToProcess = true;
				} else {
					// tag data is in cache, parse
					try {
						reformedProxyTags = JSON.parse(proxyObject.pt ?? "[]").map(
							(c: any) => ({
								prefix: c.p,
								suffix: c.s,
							}),
						);
					} catch {
						reformedProxyTags = [];
					}
				}

				for (const proxyTag of reformedProxyTags) {
					// Ensure we have latest alter data for use deeper down the logic
					let checkAlter =
						proxyObject && proxyObject.pt
							? null // Data came from cache so don't fetch here unless we need further fields
							: await alterCollection.findOne({
									alterId: Number(user.system.alterIds[i]),
								});

					if (
						proxyTagValid(
							proxyTag,
							message,
							getSystemFeatures(user.system).caseInsensitiveProxies,
						)
					) {
						message.client.logger.info("Attempted to proxy: {proxyTag}", {
							proxyTag,
						});
						const locale = await getLanguageByUserId(message.author.id);
						// Check for system tag policy
						if (
							message.guildId &&
							guild.getFeatures().requiresGuildTag &&
							(((user.system?.displayTagMap ?? {})[message.guildId] ??
								user.system.systemDisplayTag) === undefined ||
								((user.system?.displayTagMap ?? {})[message.guildId] ??
									user.system.systemDisplayTag) === null)
						) {
							endTimer(`proxy: bruteforce proxy (${message.id})`);
							createProxyError(user, message, {
								title: locale.DISPLAY_TAG_ENFORCE,
								description: locale.DISPLAY_TAG_ENFORCE_DESC,
								type: "EnforcedGuildTagRegulation",
								setSystemTag: locale.ALTER_SET_TAG,
							});

							removeFromMap();
							return;
						}

						// Only get more data about the alter after confirmation of proxy tag
						if (!checkAlter) {
							checkAlter = await alterCollection.findOne({
								alterId: new Double(user.system.alterIds[i] ?? 3),
							});
						}

						if (!(await blockedRole(guild, locale, message))) {
							endTimer(`proxy: bruteforce proxy (${message.id})`);
							removeFromMap();
							return;
						}
						if (!(await blockedChannel(guild, locale, message))) {
							endTimer(`proxy: bruteforce proxy (${message.id})`);
							removeFromMap();
							return;
						}

						removeFromMap();
						performTagProxy(
							checkAlter as PAlter,
							user,
							similarWebhooks,
							proxyTag,
							message,
							guild,
							message.member,
						);

						return;
					}
				}
			}

			removeFromMap();
		}

		if (apMode.autoproxyMode === "latch") {
			startTimer(`proxy: latch proxy (${message.id})`);

			if (message.content.startsWith("\\\\")) {
				setLastLatchAlter(guild.guildId, message.channelId, user.system);
				return;
			}
			if (message.content.startsWith("\\")) return;

			const HOUR = 3_600_000;

			if (user.system.latchExpiration)
				if (
					(apMode?.lastLatchTimestamp?.getTime() ?? Date.now()) +
						user.system.latchExpiration <
					Date.now()
				) {
					setLastLatchAlter(guild.guildId, message.channelId, user.system);
					return;
				}

			const alter = apMode?.autoproxyAlter;

			if (alter) {
				const fetchedAlter = await alterCollection.findOne({
					alterId: Number(alter),
					systemId: message.author.id,
				});

				if (
					message.guildId &&
					guild.getFeatures().requiresGuildTag &&
					(((user.system?.displayTagMap ?? {})[message.guildId] ??
						user.system.systemDisplayTag) === undefined ||
						((user.system?.displayTagMap ?? {})[message.guildId] ??
							user.system.systemDisplayTag) === null)
				) {
					const locale = await getLanguageByUserId(message.author.id);
					endTimer(`proxy: bruteforce proxy (${message.id})`);
					createProxyError(user, message, {
						title: locale.DISPLAY_TAG_ENFORCE,
						description: locale.DISPLAY_TAG_ENFORCE_DESC,
						type: "EnforcedGuildTagRegulation",
						setSystemTag: locale.ALTER_SET_TAG,
					});

					return;
				}
				if (fetchedAlter) {
					const locale = await getLanguageByUserId(message.author.id);

					if (!(await blockedRole(guild, locale, message, true))) return;
					if (!(await blockedChannel(guild, locale, message, true))) return;

					endTimer(`proxy: latch proxy (${message.id})`);
					performAlterAutoProxy(
						message,
						similarWebhooks,
						fetchedAlter,
						user,
						guild,
						message.member,
					);
				}
			}
		}
	},
});
