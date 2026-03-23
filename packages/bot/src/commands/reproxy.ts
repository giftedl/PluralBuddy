import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { getSimilarWebhooks } from "@/lib/proxying/util";
import { alterCollection, messagesCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { Message, Section, Separator, Thumbnail, type TopLevelBuilders } from "seyfert";
import {
	AttachmentBuilder,
	CommandContext,
	Container,
	createStringOption,
	Declare,
	MediaGallery,
	Options,
	TextDisplay,
} from "seyfert";
import { Command, IgnoreCommand } from "seyfert";
import {
	ComponentType,
	MessageFlags,
	Spacing,
	type APIContainerComponent,
	type APIMediaGalleryComponent,
	type APITextDisplayComponent,
} from "seyfert/lib/types";
import { client } from "..";
import { getGuildFromId } from "@/types/guild";
import { getColor } from "colorthief";
import { emojis } from "@/lib/emojis";
import { createError } from "@/lib/create-error";
import { pendingIgnoreDeletion } from "@/events/on-message-delete";

const options = {
	alter: createStringOption({
		description: "Alter to reproxy as",
		autocomplete: autocompleteAlters,
		required: true,
	}),
};

@Declare({
	name: "reproxy",
	description: "Reproxy as an alter",
	contexts: ["Guild"],
})
@Options(options)
export default class ReproxyCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);
		const { system } = await ctx.retrievePUser();
		const { alter: alterName } = ctx.options;

		const systemId = ctx.author.id;

		const alter =
			ctx.contextAlter() ??
			(await (Number.isNaN(Number.parseInt(alterName))
				? alterCollection.findOne({ $or: [{ username: alterName }], systemId })
				: alterCollection.findOne({
						$or: [{ username: alterName }, { alterId: Number(alterName) }],
						systemId,
					})));

		if (system === undefined) {
			return await ctx.ephemeral(
				{
					components: new AlertView(ctx.userTranslations()).errorView(
						"ERROR_SYSTEM_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}
		if (alter === null) {
			return await ctx.ephemeral(
				{
					components: new AlertView(ctx.userTranslations()).errorView(
						"ERROR_ALTER_DOESNT_EXIST",
					),
					flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
				},
				undefined,
				undefined,
				ctx,
			);
		}

		const referencedMessageId = (ctx.message as Message | undefined)
			?.referencedMessage?.id;
		const message = await messagesCollection.findOne(
			{
				systemId: ctx.author.id,
				channelId: ctx.channelId,
				...(referencedMessageId ? { messageId: referencedMessageId } : {}),
			},
			{ sort: { createdAt: -1 } },
		);

		console.log(message);

		if (message === null) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"NOT_RECENT_ENOUGH",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const { messageId } = message;

		if (
			message?.systemId !== ctx.author.id ||
			message.guildId !== ctx.guildId
		) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_OWN_MESSAGE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}
		const channel = await ctx.channel();
		const parent =
			"parentId" in channel && channel.isThread() ? channel.parentId : null;

		const similarWebhooks = await getSimilarWebhooks(
			parent ?? message.channelId,
		);
		const originalMessage = await client.messages
			.fetch(message.messageId, message.channelId)
			.catch(() => null);

		if (similarWebhooks[0] === undefined || originalMessage === null) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_MANUAL_PROXY",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const webhook = similarWebhooks[0];

		const username = `${alter.nameMap.find((c) => c.server === ctx.guildId)?.name ?? alter?.displayName ?? ""} ${(system?.displayTagMap ?? {})[ctx.guildId ?? ""] ?? system?.systemDisplayTag ?? ""}`;

		pendingIgnoreDeletion.push(message.messageId)

		webhook.messages
			.write({
				body: {
					components: originalMessage.components
						.map((v) => v.toBuilder())
						.filter((v) => v !== undefined) as TopLevelBuilders[],
					flags: MessageFlags.IsComponentsV2,
					username: username.substring(0, 80),
					allowed_mentions: { parse: [] },
					avatar_url:
						(alter.avatarUrlMap ?? {})[ctx.guildId ?? ""] ??
						alter?.avatarUrl ??
						undefined,
					attachments: originalMessage.attachments,
				},
				query: {
					wait: true,
					...(parent === null ? {} : {thread_id: ctx.channelId} ),
				},
			})
			.then((sentMessage) => {
				messagesCollection.replaceOne(
					{ messageId: message.messageId },
					{
						messageId: sentMessage?.id ?? "0",
						alterId: alter.alterId,
						systemId,
						createdAt: new Date(),
						channelId: sentMessage?.channelId ?? "0",
						guildId: message.guildId,
					},
				).then(v => console.log(v));
				alterCollection.updateOne(
					{ alterId: message.alterId, systemId: alter.systemId },
					{ $inc: { messageCount: -1 } }
				);
				alterCollection.updateOne(
					{ alterId: alter.alterId, systemId: alter.systemId },
					{ $inc: { messageCount: 1 }}
				);

				(async () => {
					const guild = await getGuildFromId(ctx.guildId ?? "");
					const user = await client.users.fetch(ctx.author.id);
					const message = originalMessage.components
						.map((v) => v.toBuilder())
						.filter(v => v.data.type === ComponentType.TextDisplay)
						.map(c => (c as TextDisplay).data.content)
						.filter(c => c !== undefined)
						.filter(c => !c.startsWith(`-# ${emojis.reply}`))
						.join("");

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
-# Proxied via: /reproxy
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
					})()
			});

		await webhook.messages.delete({
			messageId,
			query: parent !== null ? { thread_id: channel.id } : {},
			reason: `Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
		});

		return await ctx
			.editResponse({
				components: new AlertView(ctx.userTranslations()).successView(
					"REPROXIED_MESSAGE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			})
			.then(() => {
				if ((ctx.message as unknown) instanceof Message) {
					const message = ctx.message as unknown as Message;

					message.delete(
						`Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
					);
				}
				setTimeout(() => ctx.deleteResponse(), 1000);
			});
	}
}
