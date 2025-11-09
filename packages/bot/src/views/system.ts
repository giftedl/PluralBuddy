/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, AttachmentBuilder, Button, Container, Section, TextDisplay, Thumbnail } from "seyfert";
import { TranslatedView } from "./translated-view";
import type { PSystem } from "../types/system";
import { ButtonStyle } from "seyfert/lib/types";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { emojis } from "../lib/emojis";

export class SystemView extends TranslatedView {
    systemProfileView(system: PSystem) {
        const innerComponents =
            new TextDisplay()
                .setContent(`## ${system.systemName}\n**Alters**: ${(system.alterIds as number[]).length}\n**Associated to:** <@${(system.associatedUserId)}> (${system.associatedUserId})`)

        return [
            new Container()
                .setComponents(
                    system.systemAvatar === undefined ?
                        innerComponents :
                        new Section()
                            .setAccessory(
                                new Thumbnail()
                                    .setMedia(system.systemAvatar as string)
                                    .setDescription(`${system.systemName}'s avatar`)
                                )
                            .setComponents(innerComponents)
                )
        ]
    }
    
    systemConfigureButton(system: PSystem) {
        return [
            new ActionRow()
                .setComponents(
                    new Button()
                        .setLabel("Configure Profile")
                        .setEmoji(emojis.wrenchWhite)
                        .setCustomId(InteractionIdentifier.Systems.ConfigurePublicProfile.create(system.associatedUserId))
                        .setStyle(ButtonStyle.Primary)
                )
        ]
    }
}