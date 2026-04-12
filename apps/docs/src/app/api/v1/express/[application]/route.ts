import { Double, MongoClient } from "mongodb";
import { after, NextRequest, NextResponse } from "next/server";
import { PAlter, PExpressApplication, PMessage } from "plurography";
import { verifyKey } from "discord-interactions";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDiscordIdBySessionId } from "@/lib/discord-id";
import { waitUntil } from "@vercel/functions";
import {
	APIApplicationCommand,
	APIApplicationCommandInteraction,
	APIApplicationCommandInteractionDataBasicOption,
	APIApplicationCommandInteractionDataStringOption,
	APIApplicationCommandPermissionsConstant,
	APIChatInputApplicationCommandInteractionData,
	APIInteraction,
	APIInteractionResponse,
	APIInteractionResponsePong,
	ApplicationCommandOptionType,
	ApplicationCommandType,
	ApplicationIntegrationType,
	ApplicationWebhookType,
	InteractionContextType,
	InteractionResponseType,
	InteractionType,
	MessageFlags,
	RESTGetAPIInteractionOriginalResponseResult,
	RESTPatchAPICurrentUserJSONBody,
	RESTPatchCurrentApplicationJSONBody,
} from "discord-api-types/v10";
import {
	ContainerBuilder,
	SlashCommandBuilder,
	TextDisplayBuilder,
} from "@discordjs/builders";
import { decryptExpressToken } from "@/lib/express-token-encryption";
import { DiscordClient } from "@/lib/express-proxying";

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

	const alters = db.collection<PAlter>("alters");
	const messages = db.collection<PMessage>("messages");
	const alterObject = await alters.findOne({
		systemId: applicationObj.owner,
		alterId: new Double(applicationObj.alterId),
	});

	if (interaction.type === InteractionType.Ping) {
		return NextResponse.json({
			type: InteractionResponseType.Pong,
		});
	}

	const botToken = await decryptExpressToken(
		applicationObj.token.iv,
		applicationObj.token.value,
	);
	const discordClient = new DiscordClient(botToken);

	if (interaction.type === InteractionType.ApplicationCommand) {
		if (
			alterObject?.systemId !==
			(interaction.user ?? interaction.member?.user)?.id
		) {
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

		const options =
			(interaction.data as APIChatInputApplicationCommandInteractionData)
				.options ?? [];
		const textOption = options.find(
			(v) =>
				v.name === "text" && v.type === ApplicationCommandOptionType.String,
		) as APIApplicationCommandInteractionDataStringOption;
		const justEmojis = (textOption?.value ?? "")
			.replace(" ", "")
			.trim()
			.split(/\s+/)
			.every((part) => /^<a?:\w+:\d+>$/.test(part));
		console.log(justEmojis);

		after(async () => {
			const interactionMessage = await discordClient.getOriginalMessage(
				application,
				interaction.token,
			);

			await messages.insertOne({
				alterId: alterObject?.alterId ?? 0,
				systemId: alterObject?.systemId ?? "",
				channelId: interaction.channel.id,
				guildId: interaction.guild_id,
				expressUserId: application,
				createdAt: new Date(),
				messageId: interactionMessage.id,
			});

			await client.close();
		});

		return NextResponse.json({
			type: InteractionResponseType.ChannelMessageWithSource,
			data: {
				components: [
					new TextDisplayBuilder()
						.setContent(`${justEmojis ? `# ` : ""}${textOption?.value ?? ""}`)
						.toJSON(),
				],
				flags: MessageFlags.IsComponentsV2,
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

	const botToken = await decryptExpressToken(
		applicationObj.token.iv,
		applicationObj.token.value,
	);
	const discordClient = new DiscordClient(botToken);

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

	await discordClient.postApplicationCommands(application, [
		new SlashCommandBuilder()
			.setName(alterObject.username.toLocaleLowerCase().substring(0, 30))
			.setDescription(`Proxy as ${alterObject.displayName.substring(0, 30)}`)
			.setIntegrationTypes(
				ApplicationIntegrationType.UserInstall,
				ApplicationIntegrationType.GuildInstall,
			)
			.setContexts(
				InteractionContextType.BotDM,
				InteractionContextType.Guild,
				InteractionContextType.PrivateChannel,
			)
			.addStringOption((option) =>
				option
					.setName("text")
					.setDescription("Text to put in the proxy tags")
					.setRequired(true),
			)
			.toJSON(),
	] as Array<APIApplicationCommand>);

	let avatarData = alterObject.avatarUrl
		? await fetch(`https://wsrv.nl/?url=${alterObject.avatarUrl}`)
		: null;
	let bannerData = alterObject.banner
		? await fetch(`https://wsrv.nl/?url=${alterObject.banner}`)
		: null;

	let finalAvatarData: string | ArrayBuffer | null = null;
	let finalBannerData: string | ArrayBuffer | null = null;

	if (avatarData?.ok) {
		finalAvatarData = `data:${avatarData.headers.get("content-type")};base64,${Buffer.from(await avatarData.arrayBuffer()).toString("base64")}`;
	}

	if (bannerData?.ok) {
		finalBannerData = `data:${bannerData.headers.get("content-type")};base64,${Buffer.from(await bannerData.arrayBuffer()).toString("base64")}`;
	}

	await discordClient.editCurrentUser({
		username: alterObject.displayName,
		avatar: finalAvatarData,
		banner: finalBannerData,
	});
	await discordClient.editCurrentApplication({
		icon: finalAvatarData,
	});

	waitUntil(client.close());
	return Response.json({ error: "Reloaded Discord commands" }, { status: 200 });
}

export async function DELETE(
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

	await applications.deleteOne({ application });

	return Response.json({}, { status: 200 });
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
