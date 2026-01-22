/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { client } from "@/index";
import { alterCollection } from "@/mongodb";
import type { PAlter } from "@/types/alter";
import type { PUser } from "@/types/user";
import { TextDisplay, type Message, type Webhook } from "seyfert";
import { getReferencedMessageString } from "../referenced-message";
import { processEmojis } from "../process-emojis";
import { proxy } from "..";
import { setLastLatchAlter } from "../util";
import { createProxyError } from "../error";

export async function performAlterAutoProxy(
	message: Message,
	similarWebhooks: Webhook[],
	alter: PAlter,
	user: PUser
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

		if (!userPerms.has(["ManageWebhooks", "ManageMessages"])) return;

		const contents = message.content;

		const { emojis: uploadedEmojis, newMessage: processedContents } =
			await processEmojis(contents);

		const messageComponents = processedContents.length === 0 ? [] : [new TextDisplay().setContent(processedContents)];

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
			alter?.avatarUrl ?? undefined,
		);
	}
}
