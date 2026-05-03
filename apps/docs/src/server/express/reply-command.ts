import { DiscordClient } from "@/lib/express-proxying";
import { ContainerBuilder, TextDisplayBuilder } from "@discordjs/builders";
import { APIInteraction, APIModalComponent, APIModalInteractionResponse, ApplicationCommandType, ComponentType, InteractionResponseType, InteractionType, MessageFlags, TextInputStyle } from "discord-api-types/v10";
import { Collection, MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { PAlter, PExpressApplication } from "plurography";

export function filter(interaction: APIInteraction, alter: PAlter) {
	return (
		interaction.type === InteractionType.ApplicationCommand &&
		interaction.data.type === ApplicationCommandType.Message
	);
}


export async function interaction(
	interaction: APIInteraction,
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

    return NextResponse.json({
        type: InteractionResponseType.Modal,
        data: {
            custom_id: "reply_express",
            title: "Reply",
            components: [
                {
                    type: ComponentType.Label,
                    label: "Message",
                    component: {
                        type: ComponentType.TextInput,
                        custom_id: "reply_express_input",
                        style: TextInputStyle.Short,
                        required: false
                    }
                },
                {
                    type: ComponentType.Label,
                    label: "Attachment",
                    component: {
                        type: ComponentType.FileUpload,
                        custom_id: "reply_express_attachment",
                        required: false
                    }
                },
            ]
        } 
    } as APIModalInteractionResponse)

}