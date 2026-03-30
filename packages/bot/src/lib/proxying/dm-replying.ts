import { client } from "@/index";
import { messagesCollection, userCollection } from "@/mongodb";
import { Button, Container, Section, TextDisplay, type Message } from "seyfert";
import {
	ButtonStyle,
	MessageFlags,
	PermissionFlagsBits,
} from "seyfert/lib/types";
import { InteractionIdentifier } from "../interaction-ids";

export async function handleDMReply(message: Message) {
	if (!message.guildId) return;
	if (!message.referencedMessage) return;

	const messageObj = await messagesCollection.findOne({
		messageId: message.referencedMessage.id,
	});

	if (!messageObj) return;

	const authorObj = await userCollection.findOne({
		userId: messageObj.systemId,
	});
	const authorMember = await client.members
		.fetch(message.guildId, messageObj.systemId)
		.catch(() => null);

	if (
		!authorMember ||
		!((authorObj?.nudging ?? { dmReply: false }).dmReply ?? false)
	)
		return;
    if (((authorObj?.nudging ?? { blockedUsers: [] as string[] }).blockedUsers ?? [] as string[]).includes(message.author.id))
        return;

	const memberPerms = await client.channels.memberPermissions(
		message.channelId,
		authorMember,
		true,
	);

	if (
		!memberPerms.has([
			PermissionFlagsBits.ViewChannel,
			PermissionFlagsBits.ReadMessageHistory,
		])
	)
		return;

	try {
		await authorMember
			.write({
				components: [
					new Container().setComponents(
						new Section()
							.setComponents(
								new TextDisplay().setContent(
									`<@${message.author.id}> replied to you in https://discord.com/channels/${message.guildId}/${message.channelId}, and you have DM replies on. [Message Link](<https://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}>)`,
								),
							)
							.setAccessory(
								new Button()
									.setStyle(ButtonStyle.Danger)
									.setLabel("Disable DM replies")
									.setCustomId(
										InteractionIdentifier.Nudge.ToggleDMReplies.create("true"),
									),
							),
					),
				],
				flags: MessageFlags.IsComponentsV2,
				allowed_mentions: { parse: [] },
			})
			.catch(() => null);
	} catch (_) {}
}
