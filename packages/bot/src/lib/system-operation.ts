/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Container, TextDisplay } from "seyfert";
import { client } from "..";
import { operationCollection } from "../mongodb";
import { operationStringGeneration, type POperation } from "../types/operation";
import type { PSystem } from "../types/system";
import type { TranslationString } from "../lang";
import { InteractionIdentifier } from "./interaction-ids";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { getUserById, writeUserById } from "../types/user";
import { emojis } from "./emojis";
import { friendlyProtectionSystem, listFromMaskSystems } from "./privacy-bitmask";

export async function createSystemOperation(system: PSystem, operation: Partial<PSystem>, translations: TranslationString, environment: "discord" | "api") {
    let oldSystem: Partial<PSystem> = {};

    // biome-ignore lint/complexity/noForEach: i'm too lazy to not foreach
    (Object.keys(operation) as (keyof PSystem)[]).forEach((v) => {
        oldSystem = {...oldSystem, [v]: system[v]}
    })

    const operationDb = {
        id: operationStringGeneration(40),
        createdAt: new Date(),
        oldSystem,
        changedOperation: operation,
        changedOperationStrings: Object.keys(operation) as (keyof PSystem)[]
    } satisfies POperation
    const listItems = operationDb.changedOperationStrings.map(c => {
        if (c === "systemName") {
            return translations.OPERATION_CHANGE_NAME.replace("%name%", operation.systemName as string)
        }
        if (c === "public") {
            return translations.OPERATION_CHANGE_PRIVACY.replace("%privacy%", ((operation.public ?? 0) > 0 ? `\`${friendlyProtectionSystem(translations, listFromMaskSystems(operation.public ?? 0)).join("`, `")}\`` : ""))
        }
        if (c === "nicknameFormat") {
            return translations.OPERATION_CHANGE_NICKNAME_FORMAT.replace("%format%", operation.nicknameFormat as string)
        }

        return "";
    })

    await operationCollection.insertOne(operationDb)

    await writeUserById(system.associatedUserId, {
        ...(await getUserById(system.associatedUserId)),
        system: {
            ...system,
            ...operation
        }
    })

    client.users.write(system.associatedUserId, {
        components: [
            new Container()
                .setComponents(
                    new TextDisplay()
                        .setContent(`## ${emojis.clockCheck} ${translations.OPERATION_HEADER}`),
                    new TextDisplay()
                        .setContent(listItems.map((c) => `- ${c}`).join("\n")),
                    new TextDisplay()
                        .setContent(`-# ${(environment === "discord" ? 
                            translations.OPERATION_DISCORD
                                .replace("%clock%", emojis.clock)
                                .replace("%discord%", emojis.discord) :  /** TODO: API stuff */ "")}
-# ${translations.OPERATION_ID.replace("%id%", `\`${operationDb.id}\``)}`)
                ).setColor("#F9DC00"),
            new ActionRow()
                .setComponents(
                    new Button()
                        .setCustomId(InteractionIdentifier.Systems.UndoOperation.create(operationDb.id))
                        .setLabel("Undo Operation")
                        .setEmoji(emojis.undo)
                        .setStyle(ButtonStyle.Primary)
                )
        ],
        flags: MessageFlags.IsComponentsV2
    })

    return {
        ...system,
        ...operation
    };
}