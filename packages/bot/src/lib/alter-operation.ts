/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Container, Section, TextDisplay } from "seyfert";
import { client } from "..";
import { operationCollection } from "../mongodb";
import { operationStringGeneration, type POperation } from "../types/operation";
import type { PAlter } from "../types/PartialAlter";
import type { TranslationString } from "../lang";
import { InteractionIdentifier } from "./interaction-ids";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { getUserById, writeUserById } from "../types/user";
import { emojis } from "./emojis";
import {
	friendlyProtectionPartialAlter,
	listFromMaskPartialAlters,
} from "./privacy-bitmask";
import convert from "./delay-converter";

export async function createPartialAlterOperation(
	PartialAlter: PAlter,
	operation: Partial<PAlter>,
	translations: TranslationString,
	environment: "discord" | "api-exchange" | "api-web",
) {
	let oldPartialAlter: PartialAlter<PAlter> = {};

	(Object.keys(operation) as (keyof PAlter)[]).forEach((v) => {
		oldPartialAlter = { ...oldPartialAlter, [v]: PartialAlter[v] };
	});

	const operationDb = {
		id: operationStringGeneration(40),
		createdAt: new Date(),
		oldPartialAlter,
		changedOperation: operation,
		changedOperationStrings: Object.keys(operation) as (keyof PAlter)[],
	} satisfies POperation;
	const listItems = await Promise.all(
		operationDb.changedOperationStrings
			.filter((v) => JSON.stringify(operation[v]) !== JSON.stringify(PartialAlter[v]))
			.map(async (c) => {
				if (c === "PartialAlterName") {
					return translations.OPERATION_CHANGE_NAME.replace(
						"%name%",
						operation.PartialAlterName as string,
					);
				}
				if (c === "public") {
					return translations.OPERATION_CHANGE_PRIVACY.replace(
						"%privacy%",
						(operation.public ?? 0) > 0
							? `\`${friendlyProtectionPartialAlter(translations, listFromMaskPartialAlters(operation.public ?? 0)).join("`, `")}\``
							: "",
					);
				}
				if (c === "nicknameFormat") {
					return translations.OPERATION_CHANGE_NICKNAME_FORMAT.replace(
						"%format%",
						(operation.nicknameFormat as string) ?? "_Unset_",
					);
				}
				if (c === "disabled") {
					return operation.disabled
						? translations.OPERATION_CHANGE_DISABLED
						: translations.OPERATION_CHANGE_ENABLED;
				}
				if (c === "PartialAlterDisplayTag") {
					return translations.OPERATION_PartialAlter_SET_PartialAlter_TAG.replace(
						"%tag%",
						(operation.PartialAlterDisplayTag as string) ?? "_Unset_",
					);
				}
				if (c === "PartialAlterAvatar") {
					return translations[
						operation.PartialAlterAvatar === null
							? "OPERATION_AVATAR_UNDEFINED"
							: "OPERATION_AVATAR"
					].replace("%link%", operation.PartialAlterAvatar as string);
				}
				if (c === "PartialAlterBanner") {
					return translations[
						operation.PartialAlterBanner === null
							? "OPERATION_BANNER_UNDEFINED"
							: "OPERATION_BANNER"
					].replace("%link%", operation.PartialAlterBanner as string);
				}
				if (c === "PartialAlterDescription") {
					return translations.OPERATION_DESCRIPTION.replace(
						"%description%",
						((operation.PartialAlterDescription as string) ?? "_Unset_")
							.split("\n")
							.join("\n > "),
					);
				}
				if (c === "PartialAlterPronouns") {
					return translations.OPERATION_PRONOUNS.replace(
						"%pronouns%",
						(operation.PartialAlterPronouns as string) ?? "_Unset_",
					);
				}
				if (c === "latchExpiration") {
					return translations.OPERATION_LATCH_DELAY.replace(
						"%delay%",
						operation.latchExpiration
							? convert(Math.floor(operation.latchExpiration / 1000))
							: "_Unset_",
					);
				}
				if (c === "displayTagMap") {
					// Get the added display tag in the map
					// Find the key in displayTagMap present in operation but not in PartialAlter, or whose value changed.
					const prevMap = PartialAlter.displayTagMap ?? {};
					const newMap = operation.displayTagMap ?? {};

					const changes: { server: string; tag: string }[] = [];

					for (const [server, tag] of Object.entries(newMap)) {
						if (!(server in prevMap) || prevMap[server] !== tag) {
							changes.push({ server, tag });
						}
					}

					if (changes[0]) {
						const { server, tag } = changes[0];
						let formalServerName = `\`${server}\``
						if (environment === "discord")
							formalServerName = `**${(await client.guilds.fetch(server)).name}**`;

						return translations.OPERATION_CHANGE_SE_TAG.replace(
							"%server%",
							formalServerName,
						).replace("%tag%", tag ?? "_Unset_");
					}
					// If somehow no difference, fallback
					return translations.OPERATION_FALLBACK.replace(
						"%property%",
						c,
					).replace("%value%", "?");
				}

				return translations.OPERATION_FALLBACK.replace("%property%", c).replace(
					"%value%",
					operation[c]?.toString() ?? "?",
				);
			}),
	);

	if (listItems.length === 0) return;

	await operationCollection.insertOne(operationDb);

	if (environment === "discord")
		await writeUserById(PartialAlter.associatedUserId, {
			...(await getUserById(PartialAlter.associatedUserId)),
			PartialAlter: {
				...PartialAlter,
				...operation,
			},
		});

	if (!PartialAlter.PartialAlterOperationDM)
		try {
			const dmChannel = await client.users
				.createDM(PartialAlter.associatedUserId, true)
				.catch(() => null);

			if (dmChannel)
				client.messages
					.write(dmChannel.id, {
						components: [
							new Container()
								.setComponents(
									new TextDisplay().setContent(
										`## ${emojis.clockCheck} ${translations.OPERATION_HEADER}`,
									),
									new Section()
										.setAccessory(
											new Button()
												.setCustomId(
													InteractionIdentifier.PartialAlters.UndoOperation.create(
														operationDb.id,
													),
												)
												.setLabel("Undo Operation")
												.setEmoji(emojis.undo)
												.setStyle(ButtonStyle.Primary),
										)
										.setComponents(
											new TextDisplay().setContent(
												listItems.map((c) => `- ${c}`).join("\n"),
											),
										),
									new TextDisplay().setContent(`-# ${
										environment === "discord"
											? translations.OPERATION_DISCORD.replace(
													"%clock%",
													emojis.clock,
												).replace("%discord%", emojis.discord)
											: environment === "api-exchange"
												? translations.OPERATION_WEB.replace(
														"%clock%",
														emojis.clock,
													).replace("%web%", emojis.web)
												: translations.OPERATION_WEB_NEXT.replace(
														"%clock%",
														emojis.clock,
													).replace("%web%", emojis.web)
									}
-# ${translations.OPERATION_ID.replace("%id%", `\`${operationDb.id}\``)}`),
								)
								.setColor("#F9DC00"),
							new Section()
								.setComponents(
									new TextDisplay().setContent(
										"-# You were notified of this action due to your association with your PluralBuddy PartialAlter.",
									),
									new TextDisplay().setContent(
										"-# Developed as open-source software @ [pb.giftedly.dev](<https://pb.giftedly.dev>)",
									),
								)
								.setAccessory(
									new Button()
										.setCustomId(InteractionIdentifier.SnoozeDMs.create())
										.setStyle(ButtonStyle.Danger)
										.setLabel("Opt-out of DMs")
										.setEmoji(emojis.xWhite),
								),
						],
						flags: MessageFlags.IsComponentsV2,
					})
					.catch(() => null);
		} catch (_) {}

	return {
		...PartialAlter,
		...operation,
	};
}
