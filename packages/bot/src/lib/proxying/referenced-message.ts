import type { Message } from "seyfert/lib/structures";
import { ComponentType } from "seyfert/lib/types";
import { emojis } from "@/lib/emojis";
import { alterCollection, messagesCollection } from "@/mongodb";

const replifyContents = (contents: string) =>
	contents
		.replace(/<a?:([a-z|A-Z|0-9]+):[0-9]+>/, ":$1:")
		.substring(0, 74)
		.replaceAll("https://", "")
		.replaceAll("http://", "")
		.replaceAll("discord.com", "discord")
		.replaceAll("\n", "")
		.replaceAll("]", "")
		.replaceAll("[", "")
		.replaceAll(/<@!?(\d+)>/g, "")
		.replaceAll("@everyone", "--")
		.replace(/<#(.*)>/, "");

export async function getReferencedMessageString(
	message: Message,
	proxyWHId: string,
) {
	let userString = `<@${message.referencedMessage?.author.id}>`;
	let messageString = `[${
		replifyContents(message.referencedMessage?.content ?? "") === ""
			? "Jump to message"
			: replifyContents(message.referencedMessage?.content ?? "")
	}](<https://discord.com/channels/${message.guildId}/${message.referencedMessage?.channelId}/${message.referencedMessage?.id}>)${((message.referencedMessage?.content ?? "").replace(/<a?:([a-z|A-Z|0-9]+):[0-9]+>/, ":$1:").length ?? 0) > 74 ? "…" : ""}`;

	if (message.referencedMessage?.webhookId === proxyWHId) {
		const messageDb = await messagesCollection.findOne({
			messageId: message.referencedMessage?.id,
		});

		if (messageDb !== null) {
			const alter = await alterCollection.findOne({
				alterId: messageDb.alterId,
			});
			let contents = message.referencedMessage.content;

			if (
				message.referencedMessage.components !== undefined &&
				contents.length === 0
			) {
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
					replifyContents(contents) === ""
						? "Jump to message"
						: replifyContents(contents)
				}](<https://discord.com/channels/${message.guildId}/${message.referencedMessage?.channelId}/${message.referencedMessage?.id}>)${((message.referencedMessage?.content ?? "").replace(/<a?:([a-z|A-Z|0-9]+):[0-9]+>/, ":$1:").length ?? 0) > 74 ? "…" : ""}`;
			}
		}
	}

	return `-# ${emojis.reply}  Replying to ${userString}: ${messageString}`;
}
