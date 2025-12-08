/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { client } from "@/index";
import type { PAlter } from "@/types/alter";
import type { PUser } from "@/types/user";
import type { Message, Webhook } from "seyfert";
import { getReferencedMessageString } from "../referenced-message";
import { TextDisplay } from "seyfert";
import { processEmojis } from "../process-emojis";
import { proxy } from "..";
import { alterCollection } from "@/mongodb";
import { setLastLatchAlter } from "../util";

export const proxyTagValid = (proxyTag: {
    prefix: string;
    suffix: string;
    id: string;
}, message: Message) => (proxyTag.suffix !== "" &&
    message.content.endsWith(proxyTag.suffix)) ||
(proxyTag.prefix !== "" &&
    message.content.startsWith(proxyTag.prefix))

export async function performTagProxy(
	checkAlter: PAlter,
	user: PUser,
	similarWebhooks: Webhook[],
	proxyTag: {
		prefix: string;
		suffix: string;
		id: string;
	},
	message: Message,
) {
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

		if (!sendingUserPerms.has(["ChangeNickname"])) return;

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

		let contents = message.content;
		if (proxyTag.prefix && contents.startsWith(proxyTag.prefix)) {
			contents = contents.slice(proxyTag.prefix.length);
		}
		if (proxyTag.suffix && contents.endsWith(proxyTag.suffix)) {
			contents = contents.slice(0, contents.length - proxyTag.suffix.length);
		}

		const trimmedContents = contents.trim();

		const { emojis: uploadedEmojis, newMessage: processedContents } =
			await processEmojis(trimmedContents);

		const messageComponents = [new TextDisplay().setContent(processedContents)];

		proxy(
			webhook,
			client,
			message,
			processedContents,
			`${checkAlter.nameMap.find((c) => c.server === message.guildId)?.name ?? checkAlter?.displayName ?? ""} ${user.system?.systemDisplayTag ?? ""}`,
			checkAlter?.alterId as number,
			checkAlter?.systemId as string,
			[...referencedMessage],
			messageComponents,
			uploadedEmojis,
			checkAlter?.avatarUrl ?? undefined,
		);
        
        if (message.guildId && user.system)
            setLastLatchAlter(checkAlter, message.guildId, user.system)
	}
}
