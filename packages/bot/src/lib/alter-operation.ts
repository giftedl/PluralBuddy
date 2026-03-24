/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Container, Section, TextDisplay, type DefaultLocale } from "seyfert";
import { client } from "..";
import { alterCollection, alterOperationCollection, operationCollection } from "../mongodb";
import { operationStringGeneration, type POperation } from "../types/operation";
import type { PAlter } from "../types/alter";
import type { TranslationString } from "../lang";
import { InteractionIdentifier } from "./interaction-ids";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { getUserById, writeUserById } from "../types/user";
import { emojis } from "./emojis";
import {
	friendlyProtectionAlters,
	listFromMaskAlters,
} from "./privacy-bitmask";
import convert from "./delay-converter";
import type { PAlterOperation } from "plurography";

export async function createPartialAlterOperation(
	changedAlterId: number,
	PartialAlter: PAlter,
	operation: Partial<PAlter>,
	translations: DefaultLocale,
	environment: "discord" | "api-exchange" | "api-web",
) {
	let oldPartialAlter: Partial<PAlter> = {};

	(Object.keys(operation) as (keyof PAlter)[]).forEach((v) => {
		oldPartialAlter = { ...oldPartialAlter, [v]: PartialAlter[v] };
	});

	const operationDb = {
		id: operationStringGeneration(40),
		createdAt: new Date(),
		oldAlter: oldPartialAlter,
		changedOperation: operation,
		changedOperationStrings: Object.keys(operation) as (keyof PAlter)[],
		changedAlterId: changedAlterId,
	} satisfies PAlterOperation;
	const listItems = await Promise.all(
		operationDb.changedOperationStrings
			.filter((v) => JSON.stringify(operation[v]) !== JSON.stringify(PartialAlter[v]))
			.map(async (c) => {
				if (c === "username") {
					return translations.OPERATION_CHANGE_NAME.replace(
						"%name%",
						operation.username as string,
					);
				}
				if (c === "public") {
					return translations.OPERATION_CHANGE_PRIVACY.replace(
						"%privacy%",
						(operation.public ?? 0) > 0
							? `\`${friendlyProtectionAlters(translations, listFromMaskAlters(operation.public ?? 0)).join("`, `")}\``
							: "",
					);
				}

				return translations.OPERATION_FALLBACK.replace("%property%", c).replace(
					"%value%",
					operation[c]?.toString() ?? "?",
				);
			}),
	);

	if (listItems.length === 0) return;

	await alterOperationCollection.insertOne(operationDb);

	if (environment === "discord")
		await alterCollection.updateOne({ alterId: changedAlterId }, { $set: operation })

	const user = await getUserById(PartialAlter.systemId)

	if (!user.system?.systemOperationDM)
		try {
			const dmChannel = await client.users
				.createDM(user.userId, true)
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
													InteractionIdentifier.Systems.UndoOperation.create(
														operationDb.id,
													),
												)
												.setDisabled(true)
												.setLabel("(currently unsupported)")
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
										translations.NOTIFIED_1,
									),
									new TextDisplay().setContent(
										translations.NOTIFIED_2,
									),
								)
								.setAccessory(
									new Button()
										.setCustomId(InteractionIdentifier.SnoozeDMs.create())
										.setStyle(ButtonStyle.Danger)
										.setLabel(translations.OPT_OUT_DMS)
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
