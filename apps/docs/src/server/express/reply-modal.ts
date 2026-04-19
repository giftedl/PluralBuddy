import { DiscordClient } from "@/lib/express-proxying";
import {
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	TextDisplayBuilder,
} from "@discordjs/builders";
import {
	APIAttachment,
	APIChatInputApplicationCommandInteractionData,
	APIInteraction,
	APIModalSubmitFileUploadComponent,
	APIModalSubmitInteraction,
	APIModalSubmitTextInputComponent,
	InteractionResponseType,
	MessageFlags,
	ModalSubmitLabelComponent,
} from "discord-api-types/v10";
import { InteractionType } from "discord-api-types/v10";
import { Collection, MongoClient } from "mongodb";
import { after, NextResponse } from "next/server";
import { PAlter, PExpressApplication } from "plurography";

export function filter(interaction: APIInteraction, alter: PAlter) {
	return (
		interaction.type === InteractionType.ModalSubmit &&
		interaction.data.custom_id === `reply_express`
	);
}

export async function interaction(
	interaction: APIModalSubmitInteraction,
	alter: PAlter,
	discordClient: DiscordClient,
	application: string,
	messages: Collection,
	client: MongoClient,
	applicationObj: PExpressApplication,
) {
	if (alter.systemId !== (interaction.user ?? interaction.member?.user)?.id) {
		return NextResponse.json({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				components: [
					new ContainerBuilder()
						.setAccentColor(11993088)
						.addTextDisplayComponents(
							new TextDisplayBuilder().setContent(
								`You are not the owner of this alter or this alter doesn't exist anymore.\n-# PluralBuddy Express • Alter: \`${applicationObj.alterId}\` • [PluralBuddy](<https://pb.giftedly.dev>)`,
							),
						)
						.toJSON(),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			},
		});
	}
	const textOption = (
		(interaction.data.components[0] as ModalSubmitLabelComponent)
			?.component as APIModalSubmitTextInputComponent
	)?.value as string | undefined;
	const attachmentOption = (
		(interaction.data.components[1] as ModalSubmitLabelComponent)
			?.component as APIModalSubmitFileUploadComponent
	)?.values[0] as string | undefined;

	const justEmojis = (textOption ?? "")
		.replace(" ", "")
		.trim()
		.split(/\s+/)
		.every((part) => /^<a?:\w+:\d+>$/.test(part));

	after(async () => {
		const interactionMessage = await discordClient.getOriginalMessage(
			application,
			interaction.token,
		);

		await messages.insertOne({
			alterId: alter.alterId ?? 0,
			systemId: alter.systemId ?? "",
			channelId: interaction.channel?.id ?? "",
			guildId: interaction.guild_id,
			expressUserId: application,
			createdAt: new Date(),
			messageId: interactionMessage.id,
		});

		await client.close();
	});

	let attachment: APIAttachment | null = null;

	if (attachmentOption) {
		attachment =
			interaction.data.resolved?.attachments?.[attachmentOption] ?? null;
	}

	return NextResponse.json({
		type: InteractionResponseType.ChannelMessageWithSource,
		data: {
			components: [
				...(applicationObj.usesContainer
					? [
							{
								...new ContainerBuilder()
									.addTextDisplayComponents(
										...(textOption
											? [
													new TextDisplayBuilder().setContent(
														`${justEmojis ? `# ` : ""}${textOption}`,
													),
												]
											: []),
									)
									.addMediaGalleryComponents(
										...(attachmentOption && attachment
											? [
													new MediaGalleryBuilder()
														.addItems(
															new MediaGalleryItemBuilder().setURL(
																attachment.url ?? "",
															),
														)
														.toJSON(),
												]
											: []),
									)
									.toJSON(),
								accent_color: alter.color ? parseInt(alter.color.split("#")[1], 16) : undefined,
							},
						]
					: [
							...(attachmentOption && attachment
								? [
										new MediaGalleryBuilder()
											.addItems(
												new MediaGalleryItemBuilder().setURL(
													attachment.url ?? "",
												),
											)
											.toJSON(),
									]
								: []),
							...(textOption
								? [
										new TextDisplayBuilder()
											.setContent(`${justEmojis ? `# ` : ""}${textOption}`)
											.toJSON(),
									]
								: []),
						]),
			],
			flags: MessageFlags.IsComponentsV2,
		},
	});
}
