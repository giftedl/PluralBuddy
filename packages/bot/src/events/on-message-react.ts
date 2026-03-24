/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { alterCollection, messagesCollection, userCollection } from "@/mongodb";
import { ActionRow, Button, createEvent, TextDisplay } from "seyfert";
import { client } from "..";
import { emojis } from "@/lib/emojis";
import { getSimilarWebhooks } from "@/lib/proxying/util";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";
import { MessageInfo } from "@/views/message-info";
import { createError } from "@/lib/create-error";
import { getLanguageByUserId } from "@/lib/lang";

export default createEvent({
	data: { name: "messageReactionAdd", once: false },
	run: async (reaction) => {
		if (reaction.userId === client.applicationId) return;

		if (
			reaction.emoji.name !== "❌" &&
			reaction.emoji.name !== "redTick" &&
			reaction.emoji.name !== "x_red" &&
			reaction.emoji.name !== "🔔" &&
			reaction.emoji.name !== "❓"
		)
			return;

		const { messageId } = reaction;
		const message = await messagesCollection.findOne({ messageId });
		const locale = await getLanguageByUserId(reaction.userId);

		if (message === null) {
			return;
		}

		const nativeMessage = await client.messages.fetch(
			reaction.messageId,
			reaction.channelId,
		);
		if (reaction.emoji.name !== null)
			await client.reactions
				.delete(
					reaction.messageId,
					reaction.channelId,
					reaction.emoji.id === null ? reaction.emoji.name : reaction.emoji,
					reaction.userId,
				)
				.catch(() => {
					createError(reaction.guildId ?? "", {
						title: locale.REACTION_ERR,
						description: locale.SELF_REACTION_DESC,
						type: "FailedMessageReaction",
						responsibleChannelId: reaction.channelId,
						responsibleUserId: reaction.userId,
					});
				});

		const react = await nativeMessage.react(emojis.loading).catch(() => null);

		if (react === null) {
			createError(reaction.guildId ?? "", {
				title: locale.REACTION_ERR,
				description: locale.SELF_REACTION_DESC,
				type: "FailedMessageReaction",
				responsibleChannelId: reaction.channelId,
				responsibleUserId: reaction.userId,
			});
		}

		if (
			reaction.emoji.name === "❌" ||
			reaction.emoji.name === "redTick" ||
			reaction.emoji.name === "x_red"
		) {
			if (
				message?.systemId !== reaction.userId ||
				message.guildId !== reaction.guildId
			) {
				await client.reactions
					.delete(
						reaction.messageId,
						reaction.channelId,
						emojis.loading,
						client.applicationId,
					)
					.catch(() => {
						createError(reaction.guildId ?? "", {
							title: locale.SELF_REACTION_ERR,
							description: locale.SELF_REACTION_DESC,
							type: "FailedMessageReaction",
							responsibleChannelId: reaction.channelId,
							responsibleUserId: reaction.userId,
						});
					});
				await nativeMessage.react(emojis.x);

				setTimeout(
					() =>
						client.reactions.delete(
							reaction.messageId,
							reaction.channelId,
							emojis.x,
							client.applicationId,
						),
					3000,
				);

				return;
			}

			const channel = await client.channels.fetch(reaction.channelId);
			const parent =
				"parentId" in channel && channel.isThread() ? channel.parentId : null;

			const similarWebhooks = await getSimilarWebhooks(parent ?? channel.id);

			if (similarWebhooks[0] === undefined) {
				await client.reactions.delete(
					reaction.messageId,
					reaction.channelId,
					emojis.loading,
					client.applicationId,
				);
				await nativeMessage.react(emojis.x);

				setTimeout(
					() =>
						client.reactions.delete(
							reaction.messageId,
							reaction.channelId,
							emojis.x,
							client.applicationId,
						),
					3000,
				);
				return;
			}

			const webhook = similarWebhooks[0];
			const user = await client.users.fetch(reaction.userId, true);

			await webhook.messages.delete({
				messageId,
				query: parent !== null ? { thread_id: channel.id } : {},
				reason: `Removed after user request of @${user.username} (${user.id})`,
			});
			return;
		}
		if (reaction.emoji.name === "🔔") {
			const nativeUser = await client.users.fetch(reaction.userId, true);
			const user = await userCollection.findOne({ userId: message.systemId });

			if (user && user?.nudging)
				if (
					!(user?.nudging.currentlyEnabled ?? true) ||
					user?.nudging.blockedUsers.includes(reaction.userId)
				) {
					client.reactions.delete(
						reaction.messageId,
						reaction.channelId,
						emojis.loading,
						client.applicationId,
					);
					return await nativeUser.write({
						components: [
							new TextDisplay().setContent(
								locale.REPLY_IN_RESPONSE.replace(
									"{{ reply }}",
									emojis.reply,
								).replace(
									"{{ link }}",
									`https://discord.com/channels/${reaction.guildId}/${reaction.channelId}/${reaction.messageId}`,
								),
							),
							...new AlertView(locale).errorView("USER_CANNOT_BE_NUDGED"),
						],
						flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					});
				}

			const alter = await alterCollection.findOne({ alterId: message.alterId });

			if (
				(
					alter?.nameMap.find((c) => c.server === reaction.guildId)?.name ??
					alter?.displayName
				)?.includes("@everyone")
			) {
				client.reactions.delete(
					reaction.messageId,
					reaction.channelId,
					emojis.loading,
					client.applicationId,
				);
				return await nativeUser.write({
					content: `-# ${emojis.reply} In response to: https://discord.com/channels/${reaction.guildId}/${reaction.channelId}/${reaction.messageId}\nThe alter name has @everyone in it, so this user cannot be nudged.`,
				});
			}

			client.reactions.delete(
				reaction.messageId,
				reaction.channelId,
				emojis.loading,
				client.applicationId,
			);
			return await client.messages.write(reaction.channelId, {
				content: `-# || \`${reaction.userId} → ${alter?.systemId}/${alter?.alterId}\` ||\n${emojis.reply} Hey, <@${message.systemId}> (${alter?.nameMap.find((c) => c.server === reaction.guildId)?.name ?? alter?.displayName})! Wake up!\n> ${emojis.lineRight} Nudged by <@${reaction.userId}>`,
				message_reference: { message_id: reaction.messageId },
				components: [
					new ActionRow().setComponents(
						new Button()
							.setCustomId(InteractionIdentifier.Nudge.Snooze.create())
							.setLabel(locale.NUDGE_SNOOZE)
							.setStyle(ButtonStyle.Primary)
							.setEmoji(emojis.xWhite),
						new Button()
							.setCustomId(
								InteractionIdentifier.Nudge.BlockUser.create(reaction.userId),
							)
							.setLabel(locale.BLOCK_SNOOZE)
							.setStyle(ButtonStyle.Secondary),
					),
				],
			});
		}
		if (reaction.emoji.name === "❓") {
			const nativeUser = await client.users.fetch(reaction.userId, true);
			const user = await userCollection.findOne({ userId: message.systemId });
			const alter = await alterCollection.findOne({ alterId: message.alterId });

			if (
				user === null ||
				user.system === undefined ||
				alter === null ||
				reaction.guildId === undefined
			) {
				client.reactions.delete(
					reaction.messageId,
					reaction.channelId,
					emojis.loading,
					client.applicationId,
				);
				return await nativeUser.write({
					components: [
						new TextDisplay().setContent(
							locale.REPLY_IN_RESPONSE.replace(
								"{{ reply }}",
								emojis.reply,
							).replace(
								"{{ link }}",
								`https://discord.com/channels/${reaction.guildId}/${reaction.channelId}/${reaction.messageId}`,
							),
						),
						...new AlertView(locale).errorView("DATA_DOESNT_EXIST"),
					],
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
			}

			const nativeGuild = await client.guilds.fetch(reaction.guildId, true);

			client.reactions.delete(
				reaction.messageId,
				reaction.channelId,
				emojis.loading,
				client.applicationId,
			);

			return await nativeUser.write({
				components: await new MessageInfo(locale).messageInfo(
					message,
					alter,
					user.system,
					nativeMessage,
					await nativeGuild.members.fetch(user.userId, true)!,
					alter.systemId !== reaction.userId,
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				allowed_mentions: { parse: [] },
			});
		}
	},
});
