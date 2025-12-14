/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { messagesCollection } from "@/mongodb";
import {
	type Webhook,
	type UsingClient,
	type TopLevelBuilders,
	type ApplicationEmoji,
	MediaGallery,
	MediaGalleryItem,
	AttachmentBuilder,
	Thumbnail,
	File,
	Embed,
} from "seyfert";
import type { Message } from "seyfert/lib/structures";
import { MessageFlags } from "seyfert/lib/types";
import { processFileAttachments } from "./process-file-attachments";
import { processUrlIntegrations } from "./process-url-attachments";
import { emojis } from "../emojis";

export const imageOrVideoExtensions = [
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".bmp",
	".svg",
	".mp4",
	".webm",
	".mov",
	".mkv",
	".mpeg",
	".heic",
	".heif",
];

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
	picture?: string,
) {
	// Process file attachments before sending the message
	const { fileAttachments } = await processFileAttachments(
		client,
		message,
		stringContents,
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

	// Build components with file attachments if any
	const components: TopLevelBuilders[] = [...reply];

	components.push(...mainContents);

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
	if ((message.stickerItems ?? []).length > 0) {
		components.push(
			...(message.stickerItems ?? []).map((c) =>
				new MediaGallery().addItems(
					new MediaGalleryItem().setMedia(`https://wsrv.nl/?url=discordapp.com/stickers/${c.id}.png&w=160&h=160`),
				),
			),
		);
	}

	if (await message.fetch().catch(() => null)) {
		// Send the message with file attachments included
		webhook.messages
			.write({
				body: {
					components,
					flags:
						components.length !== 0
							? MessageFlags.IsComponentsV2
							: (0 as MessageFlags),
					username: username.substring(0, 80),
					allowed_mentions: { parse: [] },
					avatar_url: picture,
					files: fileAttachments.map((c) =>
						new AttachmentBuilder().setFile("buffer", c.buff).setName(c.name),
					),
					embeds:
						components.length === 0
							? [
									await (async () => {
										const author = await client.users.fetch(systemId, true);

										return new Embed()
											.setDescription(
												"This message was unable to be rendered using Components V2 components. This message is not proxy-able.",
											)
											.setColor("Red")
											.setTitle(`${emojis.x}   Unable to render this message.`)
											.setAuthor({
												name: author.name,
												iconUrl: author.avatarURL(),
											})
											.setFooter({
												text: "Unable to proxy this message",
												iconUrl:
													"https://pb.giftedly.dev/image/solar-centered.png",
											});
									})(),
								]
							: [],
				},
				query: {
					wait: true,
				},
			})
			.then((sentMessage) => {
				messagesCollection
					.insertOne({
						messageId: sentMessage?.id ?? "0",
						alterId,
						systemId,
						createdAt: new Date(),
						guildId: message.guildId,
						channelId: message.channelId,
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
						uploadedEmojis,
					).catch(console.error);
				} else
					for (const emoji of uploadedEmojis) {
						emoji.delete();
					}
			});

		await message.delete();
	}
}
