/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	CacheFrom,
	Container,
	createEvent,
	Message,
	StringSelectMenu,
	StringSelectOption,
	TextDisplay,
	WebhookMessage,
	type DefaultLocale,
	type MessageStructure,
	type WebhookMessageStructure,
} from "seyfert";
import {
	ButtonStyle,
	MessageFlags,
	type RESTPatchAPIWebhookWithTokenMessageJSONBody,
	type RESTPatchAPIWebhookWithTokenMessageQuery,
	type RESTPostAPIWebhookWithTokenJSONBody,
	type RESTPostAPIWebhookWithTokenQuery,
} from "seyfert/lib/types";
import { getUserById } from "../types/user";
import { alterCollection, errorCollection } from "../mongodb";
import { AlertView } from "@/views/alert";
import {
	performTagProxy,
	proxyTagValid,
} from "@/lib/proxying/types/tag-proxying";
import type { PAlter } from "@/types/alter";
import {
	getSimilarWebhooks,
	isValidDm,
	notValidPermissions,
	setLastLatchAlter,
	startsWithPrefix,
} from "@/lib/proxying/util";
import { performAlterAutoProxy } from "@/lib/proxying/types/alter-ap";
import { getGuildFromId, PGuildObject } from "@/types/guild";
import { createError } from "@/lib/create-error";
import { emojis } from "@/lib/emojis";
import { createProxyError } from "@/lib/proxying/error";
import { helpPages } from "@/commands/help";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { buildNumber, client } from "..";
import type { ResolverProps, SendResolverProps } from "seyfert/lib/common";
import { blacklistedChannel, blacklistedRole } from "@/lib/blacklisted";
import { latencyDataPoints } from "@/analytics";
import { handleDMReply } from "@/lib/proxying/dm-replying";
import { getLanguageByUserId } from "@/lib/lang";

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

			return await message.reply({
				components: [
					new TextDisplay().setContent(
						locale.AWAKE.replace("{{ buildNumber }}", String(buildNumber)).replace("{{ branch }}", process.env.BRANCH ?? "unknown")
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
					...new AlertView(locale).errorView(
						"NO_DM_CHANNELS",
					),
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

		console.time("proxy tag parse");
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
		if (user.blacklisted) return;
		if (user.system.disabled) return;
		if (
			user.system.systemAutoproxy.some(
				(ap) => ap.autoproxyMode === "alter" && ap.serverId === message.guildId,
			)
		) {
			const alter = user.system.systemAutoproxy.find(
				(ap) => ap.autoproxyMode === "alter" && ap.serverId === message.guildId,
			)?.autoproxyAlter;

			if (message.content.startsWith("\\")) {
				return;
			}

			if (alter) {
				const fetchedAlter = await alterCollection.findOne({
					alterId: Number(alter),
					systemId: message.author.id,
				});

				console.timeEnd("proxy tag parse");

				if (fetchedAlter) {
					const locale = await getLanguageByUserId(message.author.id);
					
					if (!(await blacklistedRole(guild, locale, message))) return;
					if (!(await blacklistedChannel(guild, locale, message))) return;

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

		if (user.system.alterIds.length === 0) return;

		if (!indexingMap[message.author.id]) {
			let indexingMessage: MessageStructure | null =
				null as MessageStructure | null;
			let eligibleToProcess = false;
			let locale: DefaultLocale | null = null;

			const indexingTimeout = setTimeout(async () => {
				if (locale === null)
					locale = await getLanguageByUserId(message.author.id);
				const channel = message.channelId;

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
			}

			// Only find the alters that we need
			for (let i = 0; i < user.system.alterIds.length; i++) {
				const alterIdStr = user.system.alterIds[i]?.toString() ?? "";
				console.time(`alter number #${i}`)
				let proxyObject = await message.client.cache.alterProxy.get(alterIdStr);
				console.timeEnd(`alter number #${i}`)
				let reformedProxyTags: { prefix: string; suffix: string }[] = [];

				if (i % 20 === 0 && indexingMessage) {
					const locale = await getLanguageByUserId(message.author.id);

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

					if (proxyTagValid(proxyTag, message)) {
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
							createProxyError(user, message, {
								title: locale.DISPLAY_TAG_ENFORCE,
								description: locale.DISPLAY_TAG_ENFORCE_DESC,
								type: "EnforcedGuildTagRegulation",
							});

							removeFromMap();
							return;
						}

						// Only get more data about the alter after confirmation of proxy tag
						if (!checkAlter) {
							checkAlter = await alterCollection.findOne({
								alterId: user.system.alterIds[i],
							});
						}

						console.timeEnd("proxy tag parse");

						if (!(await blacklistedRole(guild, locale, message))) {
							removeFromMap();
							return;
						}
						if (!(await blacklistedChannel(guild, locale, message))) {
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

		if (
			user.system.systemAutoproxy.some(
				(ap) => ap.autoproxyMode === "latch" && ap.serverId === message.guildId,
			)
		) {
			
			if (message.content.startsWith("\\")) {
				setLastLatchAlter(guild.guildId, user.system);
				return;
			}

			const currentAutoProxyPolicy = user.system.systemAutoproxy.find(
				(ap) => ap.autoproxyMode === "latch" && ap.serverId === message.guildId,
			);

			const HOUR = 3_600_000;

			if (user.system.latchExpiration)
				if (
					(currentAutoProxyPolicy?.lastLatchTimestamp?.getTime() ??
						Date.now()) +
						user.system.latchExpiration <
					Date.now()
				) {
					setLastLatchAlter(guild.guildId, user.system);
					return;
				}

			const alter = currentAutoProxyPolicy?.autoproxyAlter;

			if (alter) {
				const fetchedAlter = await alterCollection.findOne({
					alterId: Number(alter),
					systemId: message.author.id,
				});
				console.timeEnd("proxy tag parse");

				if (fetchedAlter) {
					const locale = await getLanguageByUserId(message.author.id);

					if (!(await blacklistedRole(guild, locale, message, true))) return;
					if (!(await blacklistedChannel(guild, locale, message, true))) return;

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
		console.timeEnd("proxy tag parse");
	},
});
