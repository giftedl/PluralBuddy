/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getColor } from "colorthief";
import type { PGuild } from "plurography";
import type { GuildMember, TopLevelBuilders, Webhook } from "seyfert";
import {
	AttachmentBuilder,
	Container,
	File,
	MediaGallery,
	MediaGalleryItem,
	type Message,
	Section,
	Separator,
	TextDisplay,
	Thumbnail,
} from "seyfert";
import type { TextDisplayComponent } from "seyfert/lib/components/TextDisplay";
import {
	type APITextDisplayComponent,
	ComponentType,
	MessageFlags,
	Spacing,
} from "seyfert/lib/types";
import { client } from "@/index";
import { alterCollection, messagesCollection } from "@/mongodb";
import type { PMessage } from "@/types/message";
import { createError } from "../create-error";
import { emojis } from "../emojis";
import { getModernComponentsMappings, imageOrVideoExtensions } from ".";
import { processEmojis } from "./process-emojis";
import { processFileAttachments } from "./process-file-attachments";
import { processUrlIntegrations } from "./process-url-attachments";

export async function processEditContents(
	messageData: PMessage,
	message: Message,
	webhook: Webhook,
	contents: string,
	guild: PGuild,
	author: GuildMember,
) {
	const { emojis: uploadedEmojis, newMessage: processedContents } =
		await processEmojis(contents);

	const messageComponents = [new TextDisplay().setContent(processedContents)];
	const { fileAttachments } = await processFileAttachments(
		client,
		message,
		contents,
		messageData.systemId,
		messageData.guildId,
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
				const lastMessageInChannel = await message.channel();
				let continueBool = true;

				if (
					(lastMessageInChannel.isTextable() ||
						lastMessageInChannel.isVoice()) &&
					lastMessageInChannel.lastMessageId
				) {
					const messageLast = await lastMessageInChannel.messages.list({
						limit: 2,
						before: message.id,
					});

					if (messageLast[0]) {
						const message = await messagesCollection.findOne({
							$and: [
								{ messageId: messageLast[0].id },
								{ alterId: messageData.alterId },
							],
						});
						if (message) {
							continueBool = false;
						}
					}
				}

				if (continueBool)
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

	const referencedMessage = !message.components.some(
		(v) =>
			v.data.type === ComponentType.TextDisplay &&
			v.data.content.startsWith(`-# ${emojis.reply}`),
	)
		? []
		: [
				new TextDisplay().setContent(
					(
						message.components.find(
							(v) =>
								v.data.type === ComponentType.TextDisplay &&
								v.data.content.startsWith(`-# ${emojis.reply}`),
						)?.data as APITextDisplayComponent
					).content,
				),
			];
	const components: TopLevelBuilders[] = [
		...referencedMessage,
		...roleBeforeComponents,
		...messageComponents,
		...roleAfterComponents,
	];

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

	const channel = await message.channel();
	const parent =
		"parentId" in channel && channel.isThread() ? channel.parentId : null;

	if (await message.fetch().catch(() => null)) {
		webhook.messages
			.edit({
				messageId: messageData.messageId,
				body: {
					...getModernComponentsMappings(components),
					files: fileAttachments.map((c) =>
						new AttachmentBuilder().setFile("buffer", c.buff).setName(c.name),
					),
				},
				query: {
					...(parent ? { thread_id: channel.id } : {}),
				},
			})
			.then((sentMessage) => {
				(async () => {
					if (guild.logChannel) {
						const alter = await alterCollection.findOne({
							alterId: messageData.alterId,
							systemId: messageData.systemId,
						});
						let color = "Green";

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
														contents === ""
															? "Cannot render message as string - use link above."
															: contents,
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
											new TextDisplay().setContent(`-# **Sent as an edit.**
-# Sent by system/user \`${messageData.systemId}\`, by alter \`${messageData.alterId}\`
-# Mention: @${message.user.username} (<@${messageData.systemId}>)
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
					}
				})();
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
