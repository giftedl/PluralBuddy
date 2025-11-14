/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { messagesCollection } from "@/mongodb";
import { type Webhook, type UsingClient, type TopLevelBuilders, type ApplicationEmoji, MediaGallery, MediaGalleryItem, AttachmentBuilder } from "seyfert";
import type { Message } from "seyfert/lib/structures";
import { MessageFlags } from "seyfert/lib/types";
import { processFileAttachments } from "./process-file-attachments";
import { processUrlIntegrations } from "./process-url-attachments";

export async function proxy(
    webhook: Webhook,
    client: UsingClient,
    message: Message,
    stringContents: string,
    username: string,
    alterId: number,
    systemId: string,
    reply: TopLevelBuilders[],
    mainContents: TopLevelBuilders[],
    uploadedEmojis: ApplicationEmoji[],
    picture?: string) {
    // Process file attachments before sending the message
    const { fileAttachments, hasTextContent } = await processFileAttachments(
        client,
        message,
        stringContents
    );

    // If the message is JUST an emoji
    const customEmojiRegex = /^<a?:\w+:\d+>$/;
    const unicodeEmojiRegex = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F)$/u;

    const trimmedString = stringContents.trim();

    if ((customEmojiRegex.test(trimmedString) ||
        unicodeEmojiRegex.test(trimmedString)) &&
        !trimmedString.replace(customEmojiRegex, "").replace(unicodeEmojiRegex, "")) {
    }

    // Build components with file attachments if any
    const components: TopLevelBuilders[] = [...reply];

    components.push(...mainContents);
    

    if (fileAttachments.length > 0) {
        components.push(
            new MediaGallery().addItems(
                fileAttachments.map((attachment) => new MediaGalleryItem().setMedia(`attachment://${attachment.name}`)
                )
            )
        );
    }

    // Send the message with file attachments included
    webhook.messages
        .write({
            body: {
                components,
                flags: MessageFlags.IsComponentsV2,
                username,
                allowed_mentions: { parse: [] },
                avatar_url: picture,
                files: fileAttachments.map((c) => new AttachmentBuilder().setFile("buffer", c.buff).setName(c.name)
                ),
            },
            query: {
                wait: true,
            },
        })
        .then((sentMessage) => {
            messagesCollection.insertOne({
                messageId: sentMessage?.id ?? "0",
                alterId,
                systemId,
                contents: stringContents,
                createdAt: new Date(),
            });

            if (sentMessage?.id) {
                processUrlIntegrations(
                    webhook,
                    client,
                    message,
                    sentMessage.id,
                    stringContents,
                    reply,
                    mainContents,
                    fileAttachments,
                    uploadedEmojis
                ).catch(console.error);
            } else for (const emoji of uploadedEmojis) {
                emoji.delete();
            }
        });

    // Delete original message
    await message.delete();
}
