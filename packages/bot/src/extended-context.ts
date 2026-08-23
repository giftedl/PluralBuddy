/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { assetStringGeneration, type PAlter, type PTerminology } from "plurography";
import {
	ActionRow,
	Button,
	CacheFrom,
	CommandContext,
	Container,
	type DefaultLocale,
	extendContext,
	Interaction,
	Message,
	TextDisplay,
	WebhookMessage,
} from "seyfert";
import type {
	InteractionCreateBodyRequest,
	InteractionMessageUpdateBodyRequest,
} from "seyfert/lib/common";
import {
	type APIInteraction,
	ButtonStyle,
	MessageFlags,
} from "seyfert/lib/types";
import { client, policyModal } from ".";
import { emojis } from "./lib/emojis";
import { InteractionIdentifier } from "./lib/interaction-ids";
import { getLanguageByUserId, langMemoryCache } from "./lib/lang";
import { userCollection } from "./mongodb";
import { defaultPrefixes, getGuildFromId, PGuildObject } from "./types/guild";
import { getUserById } from "./types/user";
import { LoadingView } from "./views/loading";

export const extendedContext = extendContext((interaction) => {
	let contextAlter: PAlter | null = null;

	const ephemeral = async (
		body: InteractionCreateBodyRequest,
		allowedPublic?: boolean,
		afterSendTask?: (actions: {
			editMessage: (body: InteractionCreateBodyRequest) => void;
			reply?: (body: InteractionCreateBodyRequest) => void;
		}) => void,
		ctx?: CommandContext,
	) => {
		if (interaction instanceof Message) {
			if (
				allowedPublic &&
				(interaction.content.endsWith("-p") ||
					interaction.content.endsWith("-public"))
			) {
				const writtenMessage = await ctx?.editResponse(body);

				if (afterSendTask)
					afterSendTask({
						reply: writtenMessage?.write,
						editMessage: interaction.editResponse,
					});
				return writtenMessage;
			}
			const message = await ctx?.editResponse({
				components: [
					new ActionRow().setComponents(
						new Button()
							.setEmoji(emojis.folderKeyWhite)
							.setStyle(ButtonStyle.Primary)
							.setCustomId(`ephemeral-${interaction.id}`),
					),
				],
				allowed_mentions: { replied_user: false },
			});

			if (!message) return;

			const collector = message.createComponentCollector();

			collector.run(`ephemeral-${interaction.id}`, async (i) => {
				const locale = await getLanguageByUserId(i.user.id);

				const user = await getUserById(i.user.id);

				if (user.policyStatus !== 1) {
					const modal = await i.modal(
						await policyModal(i, `ephemeral-${interaction.id}`),
						{},
					);

					await userCollection.updateOne(
						{ userId: interaction.author.id },
						{
							$set: {
								policyStatus: 1,
								storagePrefix: assetStringGeneration(8),
							},
						},
						{ upsert: true },
					);

					if (!modal) return;

					if (i.user.id !== interaction.user.id)
						return modal.write({
							components: [
								new Container().setComponents(
									new TextDisplay().setContent(locale.NOT_ORIGINAL_RECIPIENT),
								),
							],
							flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
						});

					if (i.isButton()) {
						message.delete();
						const writtenMessage = await modal.write(body, true);

						if (afterSendTask)
							afterSendTask({
								reply: interaction.message?.reply,
								editMessage: (body: InteractionCreateBodyRequest) =>
									modal.editMessage("@original", body),
							});

						return writtenMessage;
					}
				}

				if (i.user.id !== interaction.user.id)
					return i.write({
						components: [
							new Container().setComponents(
								new TextDisplay().setContent(locale.NOT_ORIGINAL_RECIPIENT),
							),
						],
						flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					});

				if (i.isButton()) {
					message.delete();
					const writtenMessage = await i.write(body, true);

					if (afterSendTask)
						afterSendTask({
							reply: interaction.message?.reply,
							editMessage: (body: InteractionCreateBodyRequest) =>
								i.editMessage("@original", body),
						});

					return writtenMessage;
				}
			});

			return message;
		}

		const writtenMessage = await interaction.editOrReply(body, true);

		if (afterSendTask)
			afterSendTask({
				editMessage: (body: InteractionCreateBodyRequest) =>
					interaction.editMessage("@original", body),
			});

		return writtenMessage;
	};
	const language = async () => {
		try {
			let data =
				langMemoryCache[interaction.user.id] ??
				(await client.cache.i18n.get(interaction.user.id))?.l;

			if (data === undefined) {
				data = (await getUserById(interaction.user.id)).userLang;
				try {
					await client.cache.i18n.set(CacheFrom.Gateway, interaction.user.id, {
						l: data,
					});
					langMemoryCache[interaction.user.id] = data;
				} catch (_) {}
			}

			return data;
		} catch (_) {
			return "en";
		}
	};

	return {
		ephemeral,
		language,
		retrievePUser: async () => getUserById(interaction.user.id),
		retrievePGuild: async () =>
			PGuildObject.parseAsync(
				await getGuildFromId(interaction.guildId ?? "??"),
			),
		userTranslations: async () => replaceTranslations((client.t(await language()).get(await language()))),
		setContextAlter: (alter: PAlter) => {
			contextAlter = alter;
		},
		contextAlter: () => contextAlter,
		loading: (translations: DefaultLocale) => {
			return {
				components: new LoadingView(translations).loadingView(),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			};
		},
		loadingEphemeral: (translations: DefaultLocale) => {
			return ephemeral({
				components: new LoadingView(translations).loadingView(),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		},
		getDefaultPrefix: async () => {
			if (interaction.guildId) {
				return (await getGuildFromId(interaction.guildId ?? "??")).prefixes[0];
			}
			return defaultPrefixes[
				(process.env.BRANCH as "production" | "canary") ?? "production"
			][0];
		},
	};
});

const replaceTranslations = (
	translations: DefaultLocale,
	terminology?: PTerminology,
) => {
	Object.keys(translations).forEach((c: string) => {
		translations[c as keyof DefaultLocale] = translations[
			c as keyof DefaultLocale
		]
			.replaceAll("an alter", "a member")
			.replaceAll("alter", "member")
			.replaceAll("Alter", "Member")
			.replaceAll("tag", "group")
			.replaceAll("Tag", "Group");
	});
	return translations;
};
