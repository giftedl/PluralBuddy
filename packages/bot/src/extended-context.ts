/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { cloneDeep } from "lodash";
import {
	assetStringGeneration,
	type PAlter,
	type PTerminology,
	terminologyDefaults,
} from "plurography";
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
import { getUserById, terminologyMemoryCache } from "./types/user";
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
	const terminology = async () => {
		try {
			let data =
				terminologyMemoryCache[interaction.user.id] ??
				(await client.cache.terminology.get(interaction.user.id))?.terms;

			if (data === undefined) {
				data = JSON.stringify(
					(await getUserById(interaction.user.id)).terminology,
				);
				try {
					await client.cache.terminology.set(
						CacheFrom.Gateway,
						interaction.user.id,
						{
							terms: data,
						},
					);
					terminologyMemoryCache[interaction.user.id] = data;
				} catch (_) {}
			}
			return JSON.parse(data);
		} catch (_) {
			return terminologyDefaults;
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
		userTranslations: async () =>
			replaceTranslations(
				client.t(await language()).get(await language()),
				await terminology(),
			),
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

const ENGLISH_VOWELS = ["a", "e", "i", "o", "u"];
const replaceTranslations = (
	translations: DefaultLocale,
	terminology: PTerminology = terminologyDefaults,
) => {
	const startsWithArray = (string: string, array: string[]) => {
		for (const item of array) {
			if (string.startsWith(item)) return true;
		}
		return false;
	};
	const clonedTranslations = cloneDeep(translations);

	const replace = () =>
		Object.keys(clonedTranslations).forEach((c: string) => {
			const conflictingPlaceholders: Record<string, string> = {};
			const placeholderRegex1 = /%([^%]+)%/g;
			const placeholderRegex2 = /(\{[^}]*\}\})/g;

			const matches = [
				...clonedTranslations[c as keyof DefaultLocale].matchAll(
					placeholderRegex1,
				),
				...clonedTranslations[c as keyof DefaultLocale].matchAll(
					placeholderRegex2,
				),
			];
			matches.forEach((match) => {
				conflictingPlaceholders[match[0]] = `{{ ${crypto.randomUUID()} }}`;
			});

			Object.entries(conflictingPlaceholders).forEach(([k, v]) => {
				clonedTranslations[c as keyof DefaultLocale] = clonedTranslations[
					c as keyof DefaultLocale
				].replaceAll(k, v);
			});
			clonedTranslations[c as keyof DefaultLocale] = clonedTranslations[
				c as keyof DefaultLocale
			]
				.replaceAll("systems", `${terminology.system_plural}`)
				.replaceAll("system", `${terminology.system}`)
				.replaceAll("System", `${terminology.system_capital}`)
				.replaceAll(
					"an alter",
					`a${startsWithArray(terminology.alters, ENGLISH_VOWELS) ? "n" : ""} ${terminology.alters}`,
				)
				.replaceAll("proxy tags", terminology.proxy_tags_plural)
				.replaceAll("proxy tag", terminology.proxy_tag)
				.replaceAll("display tag", terminology.display_tag)
				.replaceAll(
					"a tag",
					`a${startsWithArray(terminology.tags, ENGLISH_VOWELS) ? "n" : ""} ${terminology.alters}`,
				)
				.replaceAll("Alter", terminology.alters_capital)
				.replaceAll("alter", terminology.alters)
				.replaceAll("tags", terminology.tags_plural)
				.replaceAll("tag", terminology.tags)
				.replaceAll("Tag", terminology.tags_capital);
			Object.entries(conflictingPlaceholders).forEach(([k, v]) => {
				clonedTranslations[c as keyof DefaultLocale] = clonedTranslations[
					c as keyof DefaultLocale
				].replaceAll(v, k);
			});
		});

	replace();

	return clonedTranslations;
};
