/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { PMessage } from "@/types/message";
import { AttachmentBuilder, File, TextDisplay, type Message } from "seyfert";
import { processEmojis } from "./process-emojis";
import { processFileAttachments } from "./process-file-attachments";
import { client } from "@/index";
import { imageOrVideoExtensions } from ".";
import type { TopLevelBuilders, Webhook } from "seyfert";
import { getReferencedMessageString } from "./referenced-message";
import { MediaGallery } from "seyfert";
import { MediaGalleryItem } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { processUrlIntegrations } from "./process-url-attachments";

export async function processEditContents(
	messageData: PMessage,
	message: Message,
	webhook: Webhook,
	contents: string,
) {
	const { emojis: uploadedEmojis, newMessage: processedContents } =
		await processEmojis(contents);

	const messageComponents = [new TextDisplay().setContent(processedContents)];
	const { fileAttachments } = await processFileAttachments(
		client,
		message,
		contents,
        messageData.systemId,
        messageData.guildId
	);

	const mediaFiles: typeof fileAttachments = [];
	const otherFiles: typeof fileAttachments = [];

	for (const attachment of fileAttachments) {
		const lowerName = attachment.name.toLowerCase();
		const isMedia = imageOrVideoExtensions.some((ext) =>
			lowerName.endsWith(ext),
		);
		if (isMedia) {
			mediaFiles.push(attachment);
		} else {
			otherFiles.push(attachment);
		}
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
	const components: TopLevelBuilders[] = [...referencedMessage];

	components.push(...messageComponents);

	if (fileAttachments.length > 0) {
		if (mediaFiles.length > 0)
			components.push(
				new MediaGallery().addItems(
					mediaFiles.map((attachment) =>
						new MediaGalleryItem().setMedia(`attachment://${attachment.name}`),
					),
				),
			);
		if (otherFiles.length > 0)
			for (const attachment of otherFiles)
				components.push(new File().setMedia(`attachment://${attachment.name}`));
	}

	if (await message.fetch().catch(() => null)) {
		webhook.messages
			.edit({
				messageId: messageData.messageId,
				body: {
					components,
					allowed_mentions: { parse: [] },
					files: fileAttachments.map((c) =>
						new AttachmentBuilder().setFile("buffer", c.buff).setName(c.name),
					),
				},
			})
			.then((sentMessage) => {
				if (sentMessage?.id) {
					processUrlIntegrations(
						webhook,
						client,
						sentMessage,
						sentMessage.id,
						contents,
						referencedMessage,
						messageComponents,
						fileAttachments,
						uploadedEmojis,
                        undefined,
                        messageData.systemId,
                        messageData.guildId,
					).catch(console.error);
				} else
					for (const emoji of uploadedEmojis) {
						emoji.delete();
					}
			});
	}
}
