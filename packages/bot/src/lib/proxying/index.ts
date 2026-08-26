/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getColor } from "colorthief";
import {
	type ApplicationEmoji,
	AttachmentBuilder,
	Container,
	Embed,
	File,
	MediaGallery,
	MediaGalleryItem,
	Section,
	Separator,
	TextDisplay,
	Thumbnail,
	type TopLevelBuilders,
	type UsingClient,
	type Webhook,
} from "seyfert";
import type { MediaGalleryComponent } from "seyfert/lib/components/MediaGallery";
import type { TextDisplayComponent } from "seyfert/lib/components/TextDisplay";
import type { Message } from "seyfert/lib/structures";
import {
	ComponentType,
	MessageFlags,
	Spacing,
	StickerFormatType,
} from "seyfert/lib/types";
import type {
	ApplicableWebhookWritePayload,
	PWebhook,
} from "@/events/on-message-create";
import { alterCollection, messagesCollection } from "@/mongodb";
import { getGuildFromId, type PGuild } from "@/types/guild";
import { createError } from "../create-error";
import { emojis } from "../emojis";
import { processFileAttachments } from "./process-file-attachments";
import { processUrlIntegrations } from "./process-url-attachments";

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
						new MediaGalleryItem()
							.setMedia(`attachment://${attachment.name}`)
							.setSpoiler(attachment.spoilered),
					),
				),
			);
		if (otherFiles.length > 0)
			for (const attachment of otherFiles)
				components.push(
					new File()
						.setMedia(`attachment://${attachment.name}`)
						.setSpoiler(attachment.spoilered),
				);
	}
	if ((message.stickerItems ?? []).length > 0) {
		components.push(
			...(message.stickerItems ?? []).map((c) =>
				new MediaGallery().addItems(
					new MediaGalleryItem().setMedia(
						`https://media.discordapp.net/stickers/${c.id}.${c.formatType === StickerFormatType.GIF ? "gif" : c.formatType === StickerFormatType.PNG ? "png" : c.formatType === StickerFormatType.APNG ? "png" : "lottie"}?size=256`,
					),
				),
			),
		);
	}

	await new Promise((d) => setTimeout(d, guild.proxyDelay));

	const channel = await message.channel();
	const parent =
		"parentId" in channel && channel.isThread() ? channel.parentId : null;

	if (components.length === 0) {
		return;
	}

	if (await message.fetch().catch(() => null)) {
		// Send the message with file attachments included

		console.log();

		try {
			webhook.messages
				.write({
					body: {
						...getModernComponentsMappings(components, [
							...mediaFiles,
							...otherFiles,
							...fileAttachments,
						]),
						username: username.substring(0, 80),
						avatar_url: picture,
						files: fileAttachments.map((c, i) =>
							new AttachmentBuilder()
								.setFile("buffer", c.buff)
								.setName(`${c.name}`),
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
										parse: ["users"],
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
													iconUrl: "https://pb.giftedly.dev/image/pfp.png",
												});
										})(),
									]
								: [],
					},
					query: {
						wait: true,
						...(parent !== null ? { thread_id: channel.id } : {}),
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
						referencedMessage: message.referencedMessage?.id,
					});
					try {
						(async () => {
							const guild = await getGuildFromId(message.guildId ?? "");
							const user = await client.users.fetch(message.author.id);
							const alter = await alterCollection.findOne({
								alterId,
								systemId,
							});
							let color = "Green";

							if (!guild.logChannel) return;

							try {
								const image = await (
									await fetch(
										`https://wsrv.nl?url=${(alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ?? alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}`,
										{ signal: AbortSignal.timeout(3000) },
									)
								).arrayBuffer();

								color = (await getColor(image))?.hex() ?? "Green";
							} catch (_) {}

							await client.messages
								.write(guild.logChannel, {
									components: [
										new TextDisplay().setContent(
											`https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${sentMessage?.id}`,
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
															(alter?.avatarUrlMap ?? {})[
																sentMessage?.guildId ?? ""
															] ??
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
												...(message.referencedMessage
													? [
															new Separator(),
															new TextDisplay().setContent(
																"-# **REFERENCED MESSAGE**",
															),
															new TextDisplay().setContent(`-# Message author: <@${message.referencedMessage.author.id}>
-# Message ID: [${message.referencedMessage.id}](https://discord.com/channels/${message.guildId ?? "@me"}/${message.channelId}/${message.referencedMessage.id})
-# Message contents: ${message.referencedMessage.content.slice(0, 1000)}`),
														]
													: []),
											)
											.setColor(color as `#${string}` | "Green"),
									],
									flags: MessageFlags.IsComponentsV2,
									allowed_mentions: { parse: [] },
								})
								.catch(() =>
									createError(guild.guildId, {
										title: "Failed to send proxy log in log channel.",
										description:
											"PluralBuddy attempted to send a proxied log message, but failed, maybe due to a lack of permission.",
										responsibleChannelId: guild.logChannel ?? undefined,
										type: "FailedLogging",
									}),
								);
						})();
					} catch (_: unknown) {
						createError(guild.guildId, {
							title: "Failed to send proxy log in log channel.",
							description:
								"PluralBuddy attempted to send a proxied log message, but failed, maybe due to a lack of permission.",
							responsibleChannelId: guild.logChannel ?? undefined,
							type: "FailedLogging",
						});
					}

					if (sentMessage?.id && components.length !== 1) {
						processUrlIntegrations(
							webhook,
							client,
							message,
							sentMessage.id,
							stringContents,
							[...reply],
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

		await message.delete();
	}
}

export const getModernComponentsMappings = (
	components: TopLevelBuilders[],
	fileComponents: {
		buff: Buffer<ArrayBufferLike>;
		spoilered: boolean;
		name: string;
	}[] = [],
): ApplicableWebhookWritePayload["body"] => {
	if (
		components.length === 2 &&
		components[1]?.data.type === ComponentType.MediaGallery
	) {
	}
	console.log(fileComponents);
	return components.length === 1 &&
		components[0]?.data.type === ComponentType.TextDisplay
		? {
				content:
					"content" in components[0].data
						? components[0].data.content?.startsWith("# <")
							? components[0].data.content.slice(1)
							: components[0].data.content
						: "_Failed to slice this message correctly._",
			}
		: components.length === 2 &&
				(components[1]?.data.type === ComponentType.MediaGallery ||
					components[1]?.data.type === ComponentType.File)
			? {
					content:
						components[0] !== undefined && "content" in components[0].data
							? (components[0].data.content ?? "").startsWith("# <")
								? (components[0].data.content ?? "").slice(1)
								: components[0].data.content
							: "_Failed to slice this message correctly._",
					attachments: fileComponents
						.filter((v, pos) => {
							return fileComponents.indexOf(v) === pos;
						})
						.map((v, i) => ({ filename: v.name, id: String(i) })),
				}
			: components.length === 1 &&
					components[1]?.data.type === ComponentType.File
				? {
						content: "",
						attachments: fileComponents
							.filter((v, pos) => {
								return fileComponents.indexOf(v) === pos;
							})
							.map((v, i) => ({ filename: v.name, id: String(i) })),
					}
				: {
						components,
						flags:
							components.length !== 0
								? MessageFlags.IsComponentsV2
								: (0 as MessageFlags),
					};
};
