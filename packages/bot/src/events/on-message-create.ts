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
import { translations } from "@/lang/en_us";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { buildNumber, client } from "..";
import type { ResolverProps, SendResolverProps } from "seyfert/lib/common";
import { blacklistedChannel, blacklistedRole } from "@/lib/blacklisted";

const indexingMap: string[] = [];

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
		if (message.author.bot === true) return;
		if (startsWithPrefix(message)) return;
		if (message.content === `<@${message.client.applicationId}>`) {
			const guild = await getGuildFromId(message.guildId ?? "");

			if (guild.getFeatures().disabledHelp) {
				message.delete();

				await message.author.write({
					components: new AlertView(translations).errorView(
						"FEATURE_DISABLED_GUILD",
					),
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
				return;
			}

			const currentPage = helpPages[0];
			const contents = await Bun.file(`content/${currentPage?.file}`).text();

			return await message.reply({
				components: [
					new TextDisplay().setContent(
						`Hi! I'm awake, running PluralBuddy \`#${buildNumber}/${process.env.BRANCH ?? "unknown"}\`.`,
					),
					new ActionRow().setComponents(
						[
							{ n: "Invite", l: "invite" },
							{ n: "Support", l: "discord" },
							{ n: "Docs", l: "docs" },
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
								.setLabel("Previous Page")
								.setStyle(ButtonStyle.Primary),
							new Button()
								.setCustomId(
									InteractionIdentifier.Help.Page.create(
										helpPages[1] ? helpPages[1].id : "",
									),
								)
								.setDisabled(helpPages[1] === undefined)
								.setLabel("Next Page")
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
					...new AlertView(null).errorViewCustom(
						"You cannot proxy inside of DM channels. Sorry!",
					),
				],
				flags: MessageFlags.IsComponentsV2,
			});
			return;
		}
		if ((await message.channel()).isDM()) return;
		if (!message.member) return;

		if (await notValidPermissions(message)) return;

		console.time("proxy tag parse");
		const similarWebhooks =
			client.cache.similarWebhookResource.fetch(message.channelId)?.webhooks ??
			(await getSimilarWebhooks(message.channelId));
		const user = await getUserById(message.author.id);
		const guild = PGuildObject.parse(
			client.cache.pguild.get(message.guildId ?? "")?.g ??
				(await getGuildFromId(message.guildId ?? "")),
		);

		if (user.system === undefined) return;
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
					if (!(await blacklistedRole(guild, message))) return;
					if (!blacklistedChannel(guild, message)) return;

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

		if (!indexingMap.includes(message.author.id)) {
			let indexingMessage: MessageStructure | null =
				null as MessageStructure | null;

			const indexingTimeout = setTimeout(async () => {
				indexingMessage = await message.reply(
					{
						components: [
							new Container()
								.setComponents(
									new TextDisplay().setContent(
										`  ${emojis.loading}   ${translations.WAITING_INDEXING.replaceAll(
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
					},
					true,
				);
			}, 2000);
			indexingMap.push(message.author.id);

			// Only find the alters that we need
			for (let i = 0; i < user.system.alterIds.length; i++) {
				const alterIdStr = user.system.alterIds[i]?.toString() ?? "";
				let proxyObject = await message.client.cache.alterProxy.get(alterIdStr);
				let reformedProxyTags: { prefix: string; suffix: string }[] = [];

				if (i % 20 === 0 && indexingMessage) {
					await indexingMessage?.edit({
						components: [
							new Container()
								.setComponents(
									new TextDisplay().setContent(
										`  ${emojis.loading}   ${translations.WAITING_INDEXING.replaceAll(
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
						// Check for system tag policy
						if (
							guild.getFeatures().requiresGuildTag &&
							user.system.systemDisplayTag === null
						) {
							createProxyError(user, message, {
								title: "Display Tag Enforcement Policy",
								description:
									'This user cannot proxy in this server without a system tag due to the system display tag enforcement policy. Enable system tags by going into `pb;system config` -> "Public Profile".',
								type: "EnforcedGuildTagRegulation",
							});

							return;
						}

						// Only get more data about the alter after confirmation of proxy tag
						if (!checkAlter) {
							checkAlter = await alterCollection.findOne({
								alterId: user.system.alterIds[i],
							});
						}

						console.timeEnd("proxy tag parse");

						if (!(await blacklistedRole(guild, message))) return;
						if (!blacklistedChannel(guild, message)) return;

						clearTimeout(indexingTimeout);
						if (indexingMessage !== null) indexingMessage.delete();

						const authorIdIndex = indexingMap.indexOf(message.author.id);
						if (authorIdIndex !== -1) {
							indexingMap.splice(authorIdIndex, 1);
						}

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

			const authorIdIndex = indexingMap.indexOf(message.author.id);
			if (authorIdIndex !== -1) {
				indexingMap.splice(authorIdIndex, 1);
			}

			clearTimeout(indexingTimeout);
			if (indexingMessage !== null) indexingMessage.delete();
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
					if (!(await blacklistedRole(guild, message, true))) return;
					if (!blacklistedChannel(guild, message, true)) return;

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
