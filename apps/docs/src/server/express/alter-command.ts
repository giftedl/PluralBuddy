import { DiscordClient } from "@/lib/express-proxying";
import {
	ContainerBuilder,
	MediaGalleryBuilder,
	MediaGalleryItemBuilder,
	TextDisplayBuilder,
} from "@discordjs/builders";
import {
	APIApplicationCommandInteractionDataAttachmentOption,
	APIApplicationCommandInteractionDataStringOption,
	APIAttachment,
	APIChatInputApplicationCommandInteractionData,
	APIInteraction,
	ApplicationCommandOptionType,
	InteractionType,
	MessageFlags,
} from "discord-api-types/v10";
import { InteractionResponseType } from "discord-api-types/v10";
import { Collection, MongoClient } from "mongodb";
import { after, NextResponse } from "next/server";
import { PAlter, PExpressApplication, PMessage } from "plurography";

export function filter(interaction: APIInteraction, alter: PAlter) {
	return (
		interaction.type === InteractionType.ApplicationCommand &&
		interaction.data.name === alter.username.toLocaleLowerCase().substring(0, 30)
	);
}

export async function interaction(
	interaction: APIInteraction,
	alter: PAlter,
	discordClient: DiscordClient,
	application: string,
	messages: Collection<PMessage>,
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

	const data =
		interaction.data as APIChatInputApplicationCommandInteractionData;
	const options = data.options ?? [];
    const altTextOption = options.find(
        (v) => v.name === "message" && v.type === ApplicationCommandOptionType.String,
    ) as APIApplicationCommandInteractionDataStringOption
	const textOption = (options.find(
		(v) => v.name === "text" && v.type === ApplicationCommandOptionType.String,
	) ?? altTextOption) as APIApplicationCommandInteractionDataStringOption;
	const attachmentOption = options.find(
		(v) =>
			v.name === "attachment" &&
			v.type === ApplicationCommandOptionType.Attachment,
	) as APIApplicationCommandInteractionDataAttachmentOption;

	const textValue = textOption?.value ?? "";
	const justEmojis = textValue
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
		attachment = Object.values(data.resolved?.attachments ?? {})[0];
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
										...(!textOption && !attachmentOption
											? [new TextDisplayBuilder().setContent("-# (empty)...")]
											: []),
										...(textOption
											? [
													new TextDisplayBuilder().setContent(
														`${justEmojis ? `# ` : ""}${textValue}`,
													),
												]
											: []),
									)
									.addMediaGalleryComponents(
										...(attachmentOption
											? [
													new MediaGalleryBuilder().addItems(
														new MediaGalleryItemBuilder().setURL(
															attachment?.url ?? "",
														),
													),
												]
											: []),
									)
									.toJSON(),
								accent_color: alter.color ? parseInt(alter.color.split("#")[1], 16) : undefined,
							},
						]
					: [
							...(!textOption && !attachmentOption
								? [
										new TextDisplayBuilder()
											.setContent("-# (empty)...")
											.toJSON(),
									]
								: []),
							...(textOption
								? [
										new TextDisplayBuilder()
											.setContent(`${justEmojis ? `# ` : ""}${textValue}`)
											.toJSON(),
									]
								: []),
							...(attachmentOption
								? [
										new MediaGalleryBuilder()
											.addItems(
												new MediaGalleryItemBuilder().setURL(
													attachment?.url ?? "",
												),
											)
											.toJSON(),
									]
								: []),
						]),
			],
			flags: MessageFlags.IsComponentsV2,
		},
	});
}
