/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { PGuild } from "plurography";
import type {
	GuildMember,
	Message,
	TopLevelBuilders,
	User,
	Webhook,
} from "seyfert";
import { CacheFrom, Container, TextDisplay } from "seyfert";
import type { PWebhook } from "@/events/on-message-create";
import { client } from "@/index";
import { createError } from "@/lib/create-error";
import { getAlterFeatures } from "@/lib/get-alter-flags";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { alterCollection, messagesCollection } from "@/mongodb";
import type { PAlter } from "@/types/alter";
import type { PUser } from "@/types/user";
import { w } from "@/webhooks";
import { proxy } from "..";
import { createProxyError } from "../error";
import { processEmojis } from "../process-emojis";
import { getReferencedMessageString } from "../referenced-message";
import { getDisplayNameWebhook, setLastLatchAlter } from "../util";

export const proxyTagValid = (
	proxyTag: {
		prefix: string;
		suffix: string;
	},
	message: Message,
) => {
	const hasPrefix = proxyTag.prefix !== "";
	const hasSuffix = proxyTag.suffix !== "";
	if (!hasPrefix && !hasSuffix) return false;

	return (
		(!hasPrefix || message.content.startsWith(proxyTag.prefix)) &&
		(!hasSuffix || message.content.endsWith(proxyTag.suffix))
	);
};

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

		if (
			channel.isTextable() &&
			!guild.getFeatures().disabledProxyTyping &&
			user.system !== undefined &&
			!getSystemFeatures(user.system).noTypingStatus
		)
			channel.typing().catch(() => null);
	})();

	alterCollection.updateOne(
		{ alterId: checkAlter?.alterId, systemId: checkAlter?.systemId },
		{
			$inc: { messageCount: 1 },
			$set: { lastMessageTimestamp: new Date() },
		},
	);

	w(user.userId, "alter.update", {
		type: "alter.update",
		alter: {
			...checkAlter,
			messageCount: checkAlter.messageCount + 1,
			lastMessageTimestamp: new Date(),
		},
	});

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
	;
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
		if (
			proxyTag.prefix &&
			contents.startsWith(proxyTag.prefix) &&
			user.system &&
			!(
				getSystemFeatures(user.system).keepProxyTags ||
				getAlterFeatures(checkAlter).keepProxyTags
			)
		) {
			contents = contents.slice(proxyTag.prefix.length);
		}
		if (
			proxyTag.suffix &&
			contents.endsWith(proxyTag.suffix) &&
			user.system &&
			!(
				getSystemFeatures(user.system).keepProxyTags ||
				getAlterFeatures(checkAlter).keepProxyTags
			)
		) {
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

				const guildPositionRole = sortedRolePreferences.find(
					(c) => c.roleId === topPositionRole.id,
				);

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

		if (message.guildId && user.system)
			proxy(
				webhook,
				client,
				message,
				processedContents,
				getDisplayNameWebhook(checkAlter, message, user),
				checkAlter?.alterId as number,
				checkAlter?.systemId as string,
				[...referencedMessage],
				messageComponents,
				uploadedEmojis,
				guild,
				(checkAlter?.avatarUrlMap ?? {})[message.guildId] ??
					checkAlter?.avatarUrl ??
					undefined,
			);

		if (message.guildId && user.system)
			setLastLatchAlter(
				message.guildId,
				message.channelId,
				user.system,
				checkAlter,
			);
	}
}
