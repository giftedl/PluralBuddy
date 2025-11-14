import { emojis } from "@/lib/emojis";
import { messagesCollection, alterCollection } from "@/mongodb";
import type { Message } from "seyfert/lib/structures";

export async function getReferencedMessageString(message: Message, proxyWHId: string) {
    let userString = `<@${message.referencedMessage?.author.id}>`;
    let messageString = `[${message.referencedMessage?.content === "" ? "Jump to message" : message.referencedMessage?.content.substring(0, 200).replace("https://", "").replace("http://", "")}](<https://discord.com/channels/${message.guildId}/${message.referencedMessage?.channelId}/${message.referencedMessage?.id}>)`;

    if (message.referencedMessage?.webhookId === proxyWHId) {
        const messageDb = await messagesCollection.findOne({
            messageId: message.referencedMessage?.id,
        });

        if (messageDb !== null) {
            const alter = await alterCollection.findOne({
                alterId: messageDb.alterId,
            });

            if (alter !== null) {
                userString = `@${alter?.username}`;
                messageString = `[${messageDb.contents === "" ? "Jump to message" : messageDb.contents.substring(0, 200).replace("https://", "").replace("http://", "")}](<https://discord.com/channels/${message.guildId}/${message.referencedMessage?.channelId}/${message.referencedMessage?.id}>)`;
            }
        }
    }

    return `-# ${emojis.reply}  Replying to ${userString}: ${messageString}`;
}
