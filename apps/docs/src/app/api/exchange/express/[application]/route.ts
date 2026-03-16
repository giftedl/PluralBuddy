import { Double, MongoClient } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { PAlter, PExpressApplication } from "plurography";
import { verifyKey } from "discord-interactions";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { waitUntil } from "@vercel/functions";
import {
	APIApplicationCommand,
	APIApplicationCommandInteraction,
	APIApplicationCommandPermissionsConstant,
	APIChatInputApplicationCommandInteractionData,
	APIInteraction,
	APIInteractionResponse,
	APIInteractionResponsePong,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationWebhookType,
	InteractionResponseType,
	InteractionType,
	MessageFlags,
} from "discord-api-types/v10";
import {
	ContainerBuilder,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from "@discordjs/builders";

export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ application: string }> },
): Promise<NextResponse<APIInteractionResponse | { error: string }>> {
	const { application } = await params;

	const client = new MongoClient(process.env.MONGO ?? "");
	await client.connect();

	const db = client.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const applications = db.collection<PExpressApplication>("applications");
	const applicationObj = await applications.findOne({ application });

	if (!applicationObj)
		return NextResponse.json({ error: "Invalid application" }, { status: 400 });

	const { isValid, interaction } = await verifyDiscordRequest(
		request,
		applicationObj,
	);

	if (!isValid || !interaction) {
		return NextResponse.json(
			{ error: "Bad request signature." },
			{ status: 401 },
		);
	}

	if (interaction.type === InteractionType.Ping) {
		return NextResponse.json({
			type: InteractionResponseType.Pong,
		});
	}

	if (interaction.type === InteractionType.ApplicationCommand) {
		const options =
			(interaction.data as APIChatInputApplicationCommandInteractionData)
				.options ?? [];
        const textOption = options.find(v => v.name === "text" && v.type === ApplicationCommandOptionType.String);

		return NextResponse.json({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				components: [
					new ContainerBuilder()
						.addTextDisplayComponents(
							new TextDisplayBuilder().setContent(`Hi ${textOption?.value}`),
						)
						.toJSON(),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			},
		});
	}

	waitUntil(client.close());

	return NextResponse.json({
		type: InteractionResponseType.Pong,
	});
}

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ application: string }> },
) {
	const { application } = await params;

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session)
		return Response.json({ error: "Session error." }, { status: 400 });

	const client = new MongoClient(process.env.MONGO ?? "");
	await client.connect();

	const db = client.db(
		`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`,
	);
	const applications = db.collection<PExpressApplication>("applications");
	const applicationObj = await applications.findOne({ application });

	if (!applicationObj)
		return Response.json(
			{ error: "Must be owner of application" },
			{ status: 405 },
		);

	if (
		applicationObj.owner !== (await getDiscordIdBySessionId(session.user.id))
	) {
		return Response.json(
			{ error: "Must be owner of application" },
			{ status: 405 },
		);
	}

	const alters = db.collection<PAlter>("alters");
	const alterObject = await alters.findOne({
		systemId: applicationObj.owner,
		alterId: new Double(applicationObj.alterId),
	});

	if (!alterObject)
		return Response.json(
			{ error: "Parent alter doesn't exist anymore." },
			{ status: 400 },
		);

	await fetch(
		`https://discord.com/api/v10/applications/${applicationObj.application}/commands`,
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bot ${applicationObj.token}`,
			},
			method: "PUT",
			body: JSON.stringify([
				new SlashCommandBuilder()
					.setName(alterObject.username)
					.setDescription(
						`Proxy as ${alterObject.displayName.substring(0, 30)}`,
					)
					.addStringOption((option) =>
						option
							.setName("text")
							.setDescription("Text to put in the proxy tags")
							.setRequired(true),
					)
					.toJSON(),
			] as Array<APIApplicationCommand>),
		},
	);

	waitUntil(client.close());
	return Response.json({ error: "Reloaded Discord commands" }, { status: 200 });
}

async function verifyDiscordRequest(
	request: NextRequest,
	application: PExpressApplication,
): Promise<{ interaction?: APIInteraction; isValid: boolean }> {
	const signature = request.headers.get("x-signature-ed25519");
	const timestamp = request.headers.get("x-signature-timestamp");
	const body = await request.text();
	const isValidRequest =
		signature &&
		timestamp &&
		(await verifyKey(body, signature, timestamp, application.publicKey));
	if (!isValidRequest) {
		return { isValid: false };
	}

	return { interaction: JSON.parse(body), isValid: true };
}
