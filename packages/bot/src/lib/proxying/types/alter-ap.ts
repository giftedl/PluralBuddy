/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { client } from "@/index";
import { alterCollection } from "@/mongodb";
import type { PAlter } from "@/types/alter";
import type { PUser } from "@/types/user";
import {
	Container,
	GuildMember,
	TextDisplay,
	type Message,
	type TopLevelBuilders,
	type Webhook,
} from "seyfert";
import { getReferencedMessageString } from "../referenced-message";
import { processEmojis } from "../process-emojis";
import { proxy } from "..";
import { setLastLatchAlter } from "../util";
import { createProxyError } from "../error";
import type { PGuild } from "plurography";
import type {
	ApplicableWebhookWritePayload,
	PWebhook,
} from "@/events/on-message-create";
import { CacheFrom } from "seyfert";

export async function performAlterAutoProxy(
	message: Message,
	similarWebhooks: PWebhook[],
	alter: PAlter,
	user: PUser,
	guild: PGuild,
	author: GuildMember,
) {
	alterCollection.updateOne(
		{ alterId: alter?.alterId, systemId: alter?.systemId },
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

	if (alter?.alterMode === "both" || alter?.alterMode === "nickname") {
		const sendingUserPerms = await client.channels.memberPermissions(
			message.channelId,
			await client.members.fetch(message.guildId as string, message.user.id),
			true,
		);

		if (
			alter?.alterMode === "nickname" &&
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
			alter?.alterMode === "nickname" &&
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
			alter?.alterMode === "nickname" &&
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
				.replace("%username%", alter.username)
				.replace("%display%", alter.displayName)
				.substring(0, 31),
		});
	}

	if (alter?.alterMode === "both" || alter?.alterMode === "webhook") {
		if (similarWebhooks.length >= 1) {
			webhook = similarWebhooks[0];
		} else {
			webhook = await client.webhooks.create(message.channelId, {
				name: "PluralBuddy Proxy",
			});
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
			alter?.alterMode === "webhook" &&
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
				const guildPositionRole = guild.rolePreferences.find(
					(c) => topPositionRole.id === c.roleId,
				);

				if (
					guildPositionRole &&
					guildPositionRole.containerContents !== undefined
				) {
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

		const contents = message.content;

		const { emojis: uploadedEmojis, newMessage: processedContents } =
			await processEmojis(contents);

		const messageComponents =
			processedContents.length === 0
				? []
				: [
						...roleBeforeComponents,
						new TextDisplay().setContent(processedContents),
						...roleAfterComponents,
					];

		proxy(
			webhook,
			client,
			message,
			processedContents,
			`${alter.nameMap.find((c) => c.server === message.guildId)?.name ?? alter?.displayName ?? ""} ${user.system?.systemDisplayTag ?? ""}`,
			alter?.alterId as number,
			alter?.systemId as string,
			[...referencedMessage],
			messageComponents,
			uploadedEmojis,
			guild,
			alter?.avatarUrl ?? undefined,
		);
	}
}
