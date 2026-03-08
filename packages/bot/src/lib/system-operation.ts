/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Container, Section, TextDisplay } from "seyfert";
import { client } from "..";
import { operationCollection } from "../mongodb";
import { operationStringGeneration, type POperation } from "../types/operation";
import type { PSystem } from "../types/system";
import type { TranslationString } from "../lang";
import { InteractionIdentifier } from "./interaction-ids";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { getUserById, writeUserById } from "../types/user";
import { emojis } from "./emojis";
import {
	friendlyProtectionSystem,
	listFromMaskSystems,
} from "./privacy-bitmask";
import convert from "./delay-converter";

export async function createSystemOperation(
	system: PSystem,
	operation: Partial<PSystem>,
	translations: TranslationString,
	environment: "discord" | "api-exchange" | "api-web",
) {
	let oldSystem: Partial<PSystem> = {};

	(Object.keys(operation) as (keyof PSystem)[]).forEach((v) => {
		oldSystem = { ...oldSystem, [v]: system[v] };
	});

	const operationDb = {
		id: operationStringGeneration(40),
		createdAt: new Date(),
		oldSystem,
		changedOperation: operation,
		changedOperationStrings: Object.keys(operation) as (keyof PSystem)[],
	} satisfies POperation;
	const listItems = operationDb.changedOperationStrings.filter(v => operation[v]?.toString() !== system[v]?.toString()).map((c) => {
		if (c === "systemName") {
			return translations.OPERATION_CHANGE_NAME.replace(
				"%name%",
				operation.systemName as string,
			);
		}
		if (c === "public") {
			return translations.OPERATION_CHANGE_PRIVACY.replace(
				"%privacy%",
				(operation.public ?? 0) > 0
					? `\`${friendlyProtectionSystem(translations, listFromMaskSystems(operation.public ?? 0)).join("`, `")}\``
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
		if (c === "systemDisplayTag") {
			return translations.OPERATION_SYSTEM_SET_SYSTEM_TAG.replace(
				"%tag%",
				(operation.systemDisplayTag as string) ?? "_Unset_",
			);
		}
		if (c === "systemAvatar") {
			return translations[
				operation.systemAvatar === null
					? "OPERATION_AVATAR_UNDEFINED"
					: "OPERATION_AVATAR"
			].replace("%link%", operation.systemAvatar as string);
		}
		if (c === "systemBanner") {
			return translations[
				operation.systemBanner === null
					? "OPERATION_BANNER_UNDEFINED"
					: "OPERATION_BANNER"
			].replace("%link%", operation.systemBanner as string);
		}
		if (c === "systemDescription") {
			return translations.OPERATION_DESCRIPTION.replace(
				"%description%",
				((operation.systemDescription as string) ?? "_Unset_")
					.split("\n")
					.join("\n > "),
			);
		}
		if (c === "systemPronouns") {
			return translations.OPERATION_PRONOUNS.replace(
				"%pronouns%",
				(operation.systemPronouns as string) ?? "_Unset_",
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

		return translations.OPERATION_FALLBACK.replace("%property%", c).replace(
			"%value%",
			operation[c]?.toString() ?? "?",
		);
	});

	if (listItems.length === 0 )
		return;

	await operationCollection.insertOne(operationDb);

	if (environment === "discord")
		await writeUserById(system.associatedUserId, {
			...(await getUserById(system.associatedUserId)),
			system: {
				...system,
				...operation,
			},
		});

	const dmChannel = await client.users.createDM(system.associatedUserId, true)

	client.messages.write(dmChannel.id, {
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
		],
		flags: MessageFlags.IsComponentsV2,
	});

	return {
		...system,
		...operation,
	};
}
