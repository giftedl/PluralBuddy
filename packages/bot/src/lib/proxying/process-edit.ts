/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { PMessage } from "@/types/message";
import { AttachmentBuilder, Container, File, TextDisplay, type Message } from "seyfert";
import { processEmojis } from "./process-emojis";
import { processFileAttachments } from "./process-file-attachments";
import { client } from "@/index";
import { imageOrVideoExtensions } from ".";
import type { GuildMember, TopLevelBuilders, Webhook } from "seyfert";
import { getReferencedMessageString } from "./referenced-message";
import { MediaGallery } from "seyfert";
import { MediaGalleryItem } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { processUrlIntegrations } from "./process-url-attachments";
import type { PGuild } from "plurography";

export async function processEditContents(
	messageData: PMessage,
	message: Message,
	webhook: Webhook,
	contents: string,
	guild: PGuild,
	author: GuildMember
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

	const referencedMessage =
		message.referencedMessage === undefined ||
		message.referencedMessage === null
			? []
			: [
					new TextDisplay().setContent(
						await getReferencedMessageString(message, webhook.id),
					),
				];
	const components: TopLevelBuilders[] = [...referencedMessage, ...roleAfterComponents, ...messageComponents, ...roleBeforeComponents];

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
