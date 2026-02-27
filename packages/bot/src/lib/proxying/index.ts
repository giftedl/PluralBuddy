/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { alterCollection, messagesCollection } from "@/mongodb";
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
	TextDisplay,
	Container,
	Separator,
	Section,
} from "seyfert";
import type { Message } from "seyfert/lib/structures";
import { MessageFlags, Spacing, StickerFormatType } from "seyfert/lib/types";
import { processFileAttachments } from "./process-file-attachments";
import { processUrlIntegrations } from "./process-url-attachments";
import { emojis } from "../emojis";
import { getGuildFromId, type PGuild } from "@/types/guild";
import type {
	ApplicableWebhookWritePayload,
	PWebhook,
} from "@/events/on-message-create";

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
	webhook: PWebhook,
	client: UsingClient,
	message: Message,
	stringContents: string,
	username: string,
	alterId: number,
	systemId: string,
	reply: TopLevelBuilders[],
	mainContents: TopLevelBuilders[],
	uploadedEmojis: ApplicationEmoji[],
	guild: PGuild,
	picture?: string,
) {
	console.time("proxy");
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
					new MediaGalleryItem().setMedia(
						`https://media.discordapp.net/stickers/${c.id}.${c.formatType === StickerFormatType.GIF ? "gif" : c.formatType === StickerFormatType.PNG ? "png" : c.formatType === StickerFormatType.APNG ? "png" : "lottie"}?size=320`,
					),
				),
			),
		);
	}

	await new Promise((d) => setTimeout(d, guild.proxyDelay));

	if (await message.fetch().catch(() => null)) {
		// Send the message with file attachments included
		console.timeEnd("proxy");
		try {
			webhook.messages
				.write({
					body: {
						components,
						flags:
							components.length !== 0
								? MessageFlags.IsComponentsV2
								: (0 as MessageFlags),
						username: username.substring(0, 80),
						avatar_url: picture,
						files: fileAttachments.map((c) =>
							new AttachmentBuilder().setFile("buffer", c.buff).setName(c.name),
						),
						allowed_mentions:
							message.referencedMessage &&
							!message.mentions.users
								.map((v) => v.id)
								.includes(message.referencedMessage.author.id)
								? {
										parse: [],
									}
								: {
									parse: ["users"]
								},
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
												.setTitle(
													`${emojis.x}   Unable to render this message.`,
												)
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
					messagesCollection.insertOne({
						messageId: sentMessage?.id ?? "0",
						alterId,
						systemId,
						createdAt: new Date(),
						guildId: message.guildId,
						channelId: message.channelId,
					});
					try {
						(async () => {
							const guild = await getGuildFromId(message.guildId ?? "");
							const user = await client.users.fetch(message.author.id);
							const alter = await alterCollection.findOne({
								alterId,
								systemId,
							});

							if (!guild.logChannel) return;

							await client.messages.write(guild.logChannel, {
								components: [
									new TextDisplay().setContent(
										`https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${message.id}`,
									),
									new Container()
										.setComponents(
											new Section()
												.setComponents(
													new TextDisplay().setContent(
														stringContents === ""
															? "Cannot render message as string - use link above."
															: stringContents,
													),
												)
												.setAccessory(
													new Thumbnail().setMedia(
														alter?.avatarUrl ??
															"https://cdn.discordapp.com/embed/avatars/0.png",
													),
												),
											new Separator().setSpacing(Spacing.Large),
											new TextDisplay().setContent(`-# Sent by system/user \`${systemId}\`, by alter \`${alterId}\`
-# Mention: @${user.username} (<@${systemId}>)
-# Alter Mention: @${alter?.username} (${alter?.nameMap.find((c) => c.server === guild.guildId)?.name ?? alter?.username})${
												message.messageReference !== undefined
													? `
-# Reply: https://discord.com/channels/${message.messageReference.guildId ?? "@me"}/${message.messageReference.channelId}/${message.messageReference.messageId}`
													: ""
											}
-# Proxied message as: \`${message.id}\` → \`${sentMessage?.id ?? "Unknown"}\`
-# Sent at: <t:${Math.floor(Date.now() / 1000)}:f>`),
										)
										.setColor("Green"),
								],
								flags: MessageFlags.IsComponentsV2,
								allowed_mentions: { parse: [] },
							});
						})();
					} catch (_: unknown) {}

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
				})
				.catch((e) => {
					client.logger.warn(e);

					client.cache.similarWebhookResource.remove(message.channelId);
				});
		} catch (e) {
			client.logger.warn(e);

			client.cache.similarWebhookResource.remove(message.channelId);
		}

		console.time("post-proxy");
		await message.delete();
		console.timeEnd("post-proxy");
	}
}
