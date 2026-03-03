import { emojis } from "@/lib/emojis";
import { messagesCollection, alterCollection } from "@/mongodb";
import type { Message } from "seyfert/lib/structures";
import { ComponentType } from "seyfert/lib/types";

export async function getReferencedMessageString(
	message: Message,
	proxyWHId: string,
) {
	let userString = `<@${message.referencedMessage?.author.id}>`;
	let messageString = `[${
		message.referencedMessage?.content === ""
			? "Jump to message"
			: message.referencedMessage?.content
					.substring(0, 74)
					.replaceAll("https://", "")
     .replaceAll("\n", "")
					.replaceAll("http://", "")
					.replaceAll(/<@!?(\d+)>/g, "")
					.replaceAll("@everyone", ":myhonestreaction:")
	}](<https://discord.com/channels/${message.guildId}/${message.referencedMessage?.channelId}/${message.referencedMessage?.id}>)${(message.referencedMessage?.content.length ?? 0) > 74 ? "…" : ""}`;

	if (message.referencedMessage?.webhookId === proxyWHId) {
		const messageDb = await messagesCollection.findOne({
			messageId: message.referencedMessage?.id,
		});

		if (messageDb !== null) {
			const alter = await alterCollection.findOne({
				alterId: messageDb.alterId,
			});
			let contents = "";

			if (message.referencedMessage.components !== undefined) {
				if (
					message.referencedMessage.components[0] !== undefined &&
					message.referencedMessage.components[0].type ===
						ComponentType.TextDisplay
				) {
					if (
						!message.referencedMessage.components[0].content.startsWith(
							`-# ${emojis.reply}`,
						)
					)
						contents = message.referencedMessage.components[0].content;
					else if (
						message.referencedMessage.components[1] !== undefined &&
						message.referencedMessage.components[1].type ===
							ComponentType.TextDisplay
					)
						contents = message.referencedMessage.components[1].content;
				}
			}

			if (alter !== null) {
				userString = `@${alter?.username}`;
				messageString = `[${
					contents === ""
						? "Jump to message"
						: contents
								.substring(0, 74)
								.replaceAll("https://", "")
								.replaceAll("http://", "")
        .replaceAll("\n", "")
								.replaceAll(/<@!?(\d+)>/g, "")
								.replaceAll("@everyone", ":myhonestreaction:")
				}](<https://discord.com/channels/${message.guildId}/${message.referencedMessage?.channelId}/${message.referencedMessage?.id}>)${(message.referencedMessage?.content.length ?? 0) > 74 ? "…" : ""}`;
			}
		}
	}

	return `-# ${emojis.reply}  Replying to ${userString}: ${messageString}`;
}
