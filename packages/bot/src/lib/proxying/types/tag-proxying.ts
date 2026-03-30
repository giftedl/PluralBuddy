/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { client } from "@/index";
import type { PAlter } from "@/types/alter";
import type { PUser } from "@/types/user";
import type {
	GuildMember,
	Message,
	TopLevelBuilders,
	User,
	Webhook,
} from "seyfert";
import { getReferencedMessageString } from "../referenced-message";
import { CacheFrom, Container, TextDisplay } from "seyfert";
import { processEmojis } from "../process-emojis";
import { proxy } from "..";
import { alterCollection, messagesCollection } from "@/mongodb";
import { setLastLatchAlter } from "../util";
import { createProxyError } from "../error";
import type { PGuild } from "plurography";
import type { PWebhook } from "@/events/on-message-create";
import { createError } from "@/lib/create-error";

export const proxyTagValid = (
	proxyTag: {
		prefix: string;
		suffix: string;
	},
	message: Message,
) =>
	(proxyTag.suffix !== "" && message.content.endsWith(proxyTag.suffix)) ||
	(proxyTag.prefix !== "" && message.content.startsWith(proxyTag.prefix));

export async function performTagProxy(
	checkAlter: PAlter,
	user: PUser,
	similarWebhooks: PWebhook[],
	proxyTag: {
		prefix: string;
		suffix: string;
	},
	message: Message,
	guild: PGuild,
	author: GuildMember,
) {
	(async () => {
		const channel = await message.channel();

		if (channel.isTextable()) channel.typing();
	})();
	console.time("pre-proxy");
	alterCollection.updateOne(
		{ alterId: checkAlter?.alterId, systemId: checkAlter?.systemId },
		{
			$inc: { messageCount: 1 },
			$set: { lastMessageTimestamp: new Date() },
		},
	);

	let webhook = null;
	const userPerms = await client.channels.memberPermissions(
		message.channelId,
		await client.members.fetch(message.guildId as string, client.botId),
		true,
	);

	if (
		checkAlter?.alterMode === "both" ||
		checkAlter?.alterMode === "nickname"
	) {
		const sendingUserPerms = await client.channels.memberPermissions(
			message.channelId,
			await client.members.fetch(message.guildId as string, message.user.id),
			true,
		);

		if (
			checkAlter?.alterMode === "nickname" &&
			guild.getFeatures().forcedWebhookMode
		) {
			createProxyError(user, message, {
				title: "Server requires Webhook Proxy Mode",
				description:
					"You cannot proxy with an alter that is on \`nickname\` mode, as this server requires the use of the Webhook Proxy Mode.",
				type: "EnforcedProxyModeRegulation",
			});
		}

		if (guild.getFeatures().forcedWebhookMode) return;

		if (
			checkAlter?.alterMode === "nickname" &&
			!sendingUserPerms.has(["ChangeNickname"])
		) {
			createProxyError(user, message, {
				title: "User Cannot Change Nickname",
				description:
					"You cannot proxy with an alter that is on \`nickname\` mode, when you do not have the Change Nickname (\`CHANGE_NICKNAME\`) permission yourself.",
				type: "UserPermissionsRequired",
			});
		}

		if (!sendingUserPerms.has(["ChangeNickname"])) return;

		if (
			checkAlter?.alterMode === "nickname" &&
			(!userPerms.has(["ManageNicknames"]) ||
				!(await message.member?.moderatable()))
		) {
			createProxyError(user, message, {
				title: "Bot Cannot Change Nickname",
				description:
					"You cannot proxy with an alter that is on \`nickname\` mode, when the bot does not have the Manage Nicknames (\`MANAGE_NICKNAMES\`) permission. Please contact a server administrator if you believe this is incorrect.",
				type: "BotPermissionsRequired",
			});
		}

		if (
			!userPerms.has(["ManageNicknames"]) ||
			!(await message.member?.moderatable())
		)
			return;

		const systemFormat = user.system?.nicknameFormat ?? "@%username%";

		message.member?.edit({
			nick: systemFormat
				.replace("%username%", checkAlter.username)
				.replace("%display%", checkAlter.displayName)
				.substring(0, 31),
		});
	}

	if (checkAlter?.alterMode === "both" || checkAlter?.alterMode === "webhook") {
		if (similarWebhooks.length >= 1) {
			webhook = similarWebhooks[0];
		} else {
			const channel = await message.channel();
			const parent =
				"parentId" in channel && channel.isThread() ? channel.parentId : null;

			webhook = await client.webhooks
				.create(parent ?? message.channelId, {
					name: "PluralBuddy Proxy",
				})
				.catch(() => null);
			if (webhook === null) {
				createError(guild.guildId ?? "", {
					title: `Error while creating webhook for <#${channel.id}>`,
					description: `There was an error while creating the corresponding webhook for <#${channel.id}>. Check if PluralBuddy has the correct permissions in that channel.`,
					type: "WebhookFailedCreation",
					responsibleUserId: user.userId,
					responsibleChannelId: channel.id,
				});
				return;
			}
			client.cache.similarWebhookResource.set(
				CacheFrom.Gateway,
				message.channelId,
				[webhook],
			);
		}

		if (webhook === null || webhook === undefined) {
			return;
		}

		const referencedMessage =
			message.referencedMessage === undefined ||
			message.referencedMessage === null
				? []
				: [
						new TextDisplay().setContent(
							await getReferencedMessageString(message, webhook.id),
						),
					];

		if (
			checkAlter?.alterMode === "webhook" &&
			guild.getFeatures().forcedNicknameMode
		) {
			createProxyError(user, message, {
				title: "Server requires Nickname Proxy Mode",
				description:
					"You cannot proxy with an alter that is on \`webhook\` mode, as this server requires the use of the Nickname Proxy Mode.",
				type: "EnforcedProxyModeRegulation",
			});
		}

		if (guild.getFeatures().forcedNicknameMode) return;

		if (!userPerms.has(["ManageWebhooks", "ManageMessages"])) {
			createProxyError(user, message, {
				title: "Bot Cannot Efffectively Proxy",
				description:
					"This bot needs Manage Webhooks (\`MANAGE_WEBHOOKS\`) and (\`MANAGE_MESSAGES\`) to work properly. Please ask for an administrator to grant those permissions.",
				type: "BotPermissionsRequired",
			});
			return;
		}

		let contents = message.content;
		if (proxyTag.prefix && contents.startsWith(proxyTag.prefix)) {
			contents = contents.slice(proxyTag.prefix.length);
		}
		if (proxyTag.suffix && contents.endsWith(proxyTag.suffix)) {
			contents = contents.slice(0, contents.length - proxyTag.suffix.length);
		}

		const roleBeforeComponents: TopLevelBuilders[] = [];
		const roleAfterComponents: TopLevelBuilders[] = [];

		if (guild.rolePreferences.length !== 0) {
			const userRoles = await author.roles.list();
			const applicableRoles = userRoles.filter((c) =>
				guild.rolePreferences.some(
					(v) => v.roleId === c.id && v.containerContents !== undefined,
				),
			);
			const topPositionRole = applicableRoles.sort(
				(a, b) => a.position - b.position,
			)[0];
			if (topPositionRole) {
				const sortedRolePreferences = guild.rolePreferences
					.slice()
					.sort((a, b) => {
						const aRole = client.cache.roles?.get(a.roleId);
						const bRole = client.cache.roles?.get(b.roleId);

						return (bRole?.position ?? -1) - (aRole?.position ?? -1);
					});

				const guildPositionRole =
					sortedRolePreferences.find((c) => c.roleId === topPositionRole.id);

				if (
					guildPositionRole &&
					guildPositionRole.containerContents !== undefined
				) {
					const lastMessageInChannel = await message.channel();
					let continueBool = true;

					if (
						(lastMessageInChannel.isTextable() ||
							lastMessageInChannel.isVoice()) &&
						lastMessageInChannel.lastMessageId
					) {
						const messageLast = await lastMessageInChannel.messages.list({
							limit: 2,
						});

						if (
							messageLast[1] &&
							(messageLast[1].timestamp ?? 0) > Date.now() - 420000
						) {
							const message = await messagesCollection.findOne({
								$and: [
									{ messageId: messageLast[1].id },
									{ alterId: checkAlter.alterId },
								],
							});
							if (message) {
								continueBool = false;
							}
						}
					}

					if (continueBool)
						(guildPositionRole.containerLocation === "top"
							? roleBeforeComponents
							: roleAfterComponents
						).push(
							guildPositionRole.containerColor !== undefined
								? new Container()
										.setComponents(
											new TextDisplay().setContent(
												guildPositionRole.containerContents,
											),
										)
										.setColor(guildPositionRole.containerColor as `#${string}`)
								: new Container().setComponents(
										new TextDisplay().setContent(
											guildPositionRole.containerContents,
										),
									),
						);
				}
			}
		}

		const trimmedContents = contents.trim();

		const { emojis: uploadedEmojis, newMessage: processedContents } =
			await processEmojis(trimmedContents);

		const messageComponents =
			processedContents.length === 0
				? [...roleBeforeComponents, ...roleAfterComponents]
				: [
						...roleBeforeComponents,
						new TextDisplay().setContent(processedContents),
						...roleAfterComponents,
					];

		console.timeEnd("pre-proxy");
		if (message.guildId)
			proxy(
				webhook,
				client,
				message,
				processedContents,
				`${checkAlter.nameMap.find((c) => c.server === message.guildId)?.name ?? checkAlter?.displayName ?? ""} ${(user.system?.displayTagMap ?? {})[message.guildId] ?? user.system?.systemDisplayTag ?? ""}`,
				checkAlter?.alterId as number,
				checkAlter?.systemId as string,
				[...referencedMessage],
				messageComponents,
				uploadedEmojis,
				guild,
				(checkAlter?.avatarUrlMap ?? {})[message.guildId] ?? checkAlter?.avatarUrl ?? undefined,
			);

		if (message.guildId && user.system)
			setLastLatchAlter(message.guildId, user.system, checkAlter);
	}
}
