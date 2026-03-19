/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { alterCollection, messagesCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	AttachmentBuilder,
	Command,
	type CommandContext,
	Container,
	createAttachmentOption,
	createStringOption,
	Declare,
	File,
	IgnoreCommand,
	MediaGallery,
	MediaGalleryItem,
	Message,
	Options,
	Section,
	Separator,
	TextDisplay,
	Thumbnail,
	type TopLevelBuilders,
} from "seyfert";
import { MessageFlags, Spacing } from "seyfert/lib/types";
import { client } from "..";
import { getUserById } from "@/types/user";
import { processEmojis } from "@/lib/proxying/process-emojis";
import { processUrlIntegrations } from "@/lib/proxying/process-url-attachments";
import { createError } from "@/lib/create-error";
import { getGuildFromId } from "@/types/guild";
import { getColor } from "colorthief";

const options = {
	"alter-name": createStringOption({
		description: "Name of the alter to proxy",
		required: true,
		autocomplete: autocompleteAlters,
	}),
	message: createStringOption({
		description: "You need to say something. Or else you aren't talking.",
		max_length: 4000,
	}),
	attachment: createAttachmentOption({
		description: "You can also attach something.",
	}),
};

@Declare({
	name: "proxy",
	description: "Proxy as an alter",
	ignore: IgnoreCommand.Message,
	contexts: ["Guild"],
})
@Options(options)
export default class SystemCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const { "alter-name": alterName, message, attachment } = ctx.options;
		const systemId = ctx.author.id;

		if (message === undefined && attachment === undefined)
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"CONTENT_ERROR_PROXY",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});

		if (((await ctx.guild())?.memberCount ?? 0) > 30) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"SERVER_TOO_BIG",
				),

				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const query = Number.isNaN(Number.parseInt(alterName))
			? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
			: alterCollection.findOne({
					$or: [{ username: alterName }, { alterId: Number(alterName) }],
					systemId,
				});
		const alter = await query;

		if (alter === null) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_ALTER_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		const userPerms = await client.channels.memberPermissions(
			ctx.channelId,
			await client.members.fetch(ctx.guildId as string, client.botId),
			true,
		);

		const system = (await ctx.retrievePUser()).system;

		if (!userPerms.has(["ManageWebhooks", "ManageMessages"]))
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"NO_PERMISSIONS_PROXY",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});

		if (alter.alterMode === "nickname")
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"NICKNAME_MANUAL_PROXY",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});

		if (system?.disabled)
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"ERROR_DISABLED_SYSTEM",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});

		const similarWebhooks = (
			await client.webhooks.listFromChannel(ctx.channelId)
		).filter(
			(val) =>
				val.name === "PluralBuddy Proxy" &&
				(val.user ?? { id: 0 }).id === client.botId,
		);
		let webhook = null;

		if (similarWebhooks.length >= 1) {
			webhook = similarWebhooks[0];
		} else {
			webhook = await client.webhooks
				.create(ctx.channelId, {
					name: "PluralBuddy Proxy",
				})
				.catch(() => null);
			if (webhook === null) {
				createError(ctx.guildId ?? "", {
					title: `Error while creating webhook for <#${ctx.channelId}>`,
					description: `There was an error while creating the corresponding webhook for <#${ctx.channelId}>. Check if PluralBuddy has the correct permissions in that channel.`,
					type: "WebhookFailedCreation",
					responsibleUserId: ctx.author.id,
					responsibleChannelId: ctx.channelId,
				});

				return await ctx.editResponse({
					components: [
						...new AlertView(ctx.userTranslations()).errorView(
							"ERROR_MANUAL_PROXY",
						),
					],
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
			}
		}

		if (webhook === undefined)
			return await ctx.editResponse({
				components: [
					...new AlertView(ctx.userTranslations()).errorView(
						"ERROR_MANUAL_PROXY",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});

		const username = `${alter.nameMap.find((c) => c.server === ctx.guildId)?.name ?? alter?.displayName ?? ""} ${(system?.displayTagMap ?? {})[ctx.guildId ?? ""] ?? system?.systemDisplayTag ?? ""}`;
		const { emojis: uploadedEmojis, newMessage: processedContents } =
			await processEmojis(message ?? "");

		const mediaFiles: { name: string }[] = [];
		const otherFiles: { name: string }[] = [];

		if (attachment !== undefined) {
			if (
				attachment.contentType?.startsWith("video") ||
				attachment.contentType?.startsWith("image")
			)
				mediaFiles.push({ name: attachment.filename });
			else otherFiles.push({ name: attachment.filename });
		}

		const messageComponents: TopLevelBuilders[] = [];

		if (processedContents !== "")
			messageComponents.push(new TextDisplay().setContent(processedContents));

		if (mediaFiles.length > 0)
			messageComponents.push(
				new MediaGallery().addItems(
					mediaFiles.map((attachment) =>
						new MediaGalleryItem().setMedia(`attachment://${attachment.name}`),
					),
				),
			);
		if (otherFiles.length > 0)
			for (const attachment of otherFiles)
				messageComponents.push(
					new File().setMedia(`attachment://${attachment.name}`),
				);

		webhook.messages
			.write({
				body: {
					components: messageComponents,
					flags: MessageFlags.IsComponentsV2,
					username: username.substring(0, 80),
					allowed_mentions: { parse: [] },
					avatar_url:
						(alter.avatarUrlMap ?? {})[ctx.guildId ?? ""] ??
						alter?.avatarUrl ??
						undefined,
					files:
						attachment !== undefined
							? [
									new AttachmentBuilder()
										.setFile("url", attachment?.url as string)
										.setName(attachment.filename),
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
					alterId: alter.alterId,
					systemId,
					createdAt: new Date(),
					channelId: sentMessage?.channelId ?? "0",
					guildId: sentMessage?.guildId,
				});

				(async () => {
					const guild = await getGuildFromId(ctx.guildId ?? "");
					const user = await client.users.fetch(ctx.author.id);

					let color = "Green";

					if (!guild.logChannel) return;

					try {
						const image = await (
							await fetch(
								`https://wsrv.nl?url=${(alter?.avatarUrlMap ?? {})[sentMessage?.guildId ?? ""] ?? alter?.avatarUrl ?? "https://cdn.discordapp.com/embed/avatars/0.png"}`,
								{ signal: AbortSignal.timeout(3000) },
							)
						).arrayBuffer();

						color = (await getColor(image))?.hex() ?? "Green"
					} catch (_) {}

					if (!guild.logChannel) return;

					await client.messages
						.write(guild.logChannel, {
							components: [
								new TextDisplay().setContent(
									`https://discord.com/channels/${ctx.guildId ?? "@me"}/${ctx.channelId}/${sentMessage?.id}`,
								),
								new Container()
									.setComponents(
										new Section()
											.setComponents(
												new TextDisplay().setContent(
													message === "" || message === undefined
														? "Cannot render message as string - use link above."
														: message,
												),
											)
											.setAccessory(
												new Thumbnail().setMedia(
													alter?.avatarUrl ??
														"https://cdn.discordapp.com/embed/avatars/0.png",
												),
											),
										new Separator().setSpacing(Spacing.Large),
										new TextDisplay().setContent(`-# Sent by system/user \`${systemId}\`, by alter \`${alter.alterId}\`
-# Mention: @${user.username} (<@${systemId}>)
-# Alter Mention: @${alter?.username} (${alter?.nameMap.find((c) => c.server === guild.guildId)?.name ?? alter?.username})
-# Proxied message as: \`N/A\` → \`${sentMessage?.id ?? "Unknown"}\`
-# Proxied via: /proxy
-# Sent at: <t:${Math.floor(Date.now() / 1000)}:f>`),
									)
									.setColor(color as `#${string}` | "Green" ?? "Green"),
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
				if (sentMessage?.id) {
					processUrlIntegrations(
						webhook,
						client,
						sentMessage,
						sentMessage.id,
						message ?? "",
						[],
						messageComponents,
						[],
						uploadedEmojis,
						{
							channelId: ctx.channelId,
							guildId: ctx.guildId as string,
							userId: ctx.author.id,
						},
					).catch(console.error);
				} else
					for (const emoji of uploadedEmojis) {
						emoji.delete();
					}

				ctx.editResponse({
					components: new AlertView(ctx.userTranslations()).successViewCustom(
						ctx
							.userTranslations()
							.SUCCESS_PROXY.replaceAll(
								"%message-link%",
								`https://discord.com/channels/${ctx.guildId}/${sentMessage?.channelId}/${sentMessage?.id}`,
							),
					),
					flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
				});
			});
	}
}
