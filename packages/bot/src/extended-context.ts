/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	CacheFrom,
	CommandContext,
	Container,
	extendContext,
	Interaction,
	Message,
	TextDisplay,
	WebhookMessage,
} from "seyfert";
import type { InteractionCreateBodyRequest, InteractionMessageUpdateBodyRequest } from "seyfert/lib/common";
import { emojis } from "./lib/emojis";
import {
	ButtonStyle,
	MessageFlags,
	type APIInteraction,
} from "seyfert/lib/types";
import { getUserById } from "./types/user";
import { defaultPrefixes, getGuildFromId, PGuildObject } from "./types/guild";
import { translations } from "./lang/en_us";
import type { TranslationString } from "./lang";
import { LoadingView } from "./views/loading";
import type { PAlter } from "plurography";
import { client } from ".";
import { getLanguageByUserId } from "./lib/lang";

export const extendedContext = extendContext((interaction) => {
	let contextAlter: PAlter | null = null;

	const ephemeral = async (
		body: InteractionCreateBodyRequest,
		allowedPublic?: boolean,
		afterSendTask?: (actions: {
			editMessage: (body: InteractionCreateBodyRequest) => void;
			reply?: (body: InteractionCreateBodyRequest) => void;
		}) => void,
		ctx?: CommandContext
	) => {
		if (interaction instanceof Message) {
			if (
				allowedPublic &&
				(interaction.content.endsWith("-p") ||
					interaction.content.endsWith("-public"))
			) {
				const writtenMessage = await interaction.reply(body);

				if (afterSendTask)
					afterSendTask({
						reply: writtenMessage.reply,
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
			});

			if (!message) return;

			const collector = message.createComponentCollector();

			collector.run(`ephemeral-${interaction.id}`, async (i) => {
				const locale = await getLanguageByUserId(i.user.id);
				
				if (i.user.id !== interaction.user.id)
					return i.write({
						components: [
							new Container().setComponents(
								new TextDisplay().setContent(
									locale.NOT_ORIGINAL_RECIPIENT
								),
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
		let data = (await client.cache.i18n.get(interaction.user.id))?.l;

		if (data === undefined) {
			data = (await getUserById(interaction.user.id)).userLang
			await client.cache.i18n.set(CacheFrom.Gateway,interaction.user.id, {l: data});
		}

		return data;
	};

	return {
		ephemeral,
		language,
		retrievePUser: async () => getUserById(interaction.user.id),
		retrievePGuild: async () =>
			PGuildObject.parseAsync(
				await getGuildFromId(interaction.guildId ?? "??"),
			),
		userTranslations: async () => client.t(await language()).get(await language()),
		setContextAlter: (alter: PAlter) => {
			contextAlter = alter;
		},
		contextAlter: () => contextAlter,
		loading: () => {
			return {
				components: new LoadingView(translations).loadingView(),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			};
		},
		loadingEphemeral: () => {
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
