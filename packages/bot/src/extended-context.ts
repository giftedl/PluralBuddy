/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Container, extendContext, Message, TextDisplay } from "seyfert";
import type { InteractionCreateBodyRequest } from "seyfert/lib/common";
import { emojis } from "./lib/emojis";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { getUserById } from "./types/user";
import { defaultPrefixes, getGuildFromId } from "./types/guild";
import { translations } from "./lang/en_us";
import type { TranslationString } from "./lang";
import { LoadingView } from "./views/loading";


export const extendedContext = extendContext((interaction) => {
	const ephemeral = async (
		body: InteractionCreateBodyRequest,
		allowedPublic?: boolean,
	) => {
		if (interaction instanceof Message) {
			if (
				allowedPublic &&
				(interaction.content.endsWith("-p") ||
					interaction.content.endsWith("-public"))
			) {
				return await interaction.reply(body);
			}

			const message = await interaction.reply(
				{
					components: [
						new ActionRow().setComponents(
							new Button()
								.setEmoji(emojis.folderKeyWhite)
								.setStyle(ButtonStyle.Primary)
								.setCustomId(`ephemeral-${interaction.id}`),
						),
					],
				},
				true,
			);

			const collector = message.createComponentCollector();

			collector.run(`ephemeral-${interaction.id}`, async (i) => {
				if (i.user.id !== interaction.user.id)
					return i.write({
						components: [
							new Container().setComponents(
								new TextDisplay().setContent(
									"You are not the original recipient of the message.",
								),
							),
						],
						flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
					});

				if (i.isButton()) {
					message.delete();
					return i.write(body);
				}
			});

			return message;
		}
		return await interaction.write(body);
	};

	return {
		ephemeral,
		retrievePUser: async () => getUserById(interaction.user.id),
		retrievePGuild: async () => getGuildFromId(interaction.guildId ?? "??"),
		userTranslations: () => translations,
		loading: (translations: TranslationString) => {
			return {
				components: new LoadingView(translations).loadingView(),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			};
		},
		loadingEphemeral: (translations: TranslationString) => {
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