/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, Container, Section, Separator, TextDisplay, Thumbnail } from "seyfert";
import type { PAlter } from "../types/alter";
import { TranslatedView } from "./translated-view";
import type { ColorResolvable } from "seyfert/lib/common";
import type { PSystem } from "../types/system";
import { SystemSettingsView } from "./system-settings";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { ButtonStyle } from "seyfert/lib/types";
import { emojis } from "../lib/emojis";

export class AlterView extends TranslatedView {

    alterProfileView(alter: PAlter) {

        const innerComponents =
            new TextDisplay()
                .setContent(`## ${alter.displayName}
-# Also known as @${alter.username}
${alter.description ?? ""}${alter.description !== null ? "\n" : ""}
**Message Count:** ${alter.messageCount} ${alter.lastMessageTimestamp !== null ? `(last sent <t:${Math.floor(alter.lastMessageTimestamp?.getTime() / 1000)}:R>)` : ""}
**Associated to:** <@${(alter.systemId)}> (${alter.systemId})\n
-# ID: \`${alter.alterId}\``)

        const comp = new Container()
            .setComponents(
                alter.avatarUrl === null ?
                    innerComponents :
                    new Section()
                        .setAccessory(
                            new Thumbnail()
                                .setMedia(alter.avatarUrl as string)
                                .setDescription(`${alter.avatarUrl}'s avatar`)
                            )
                        .setComponents(innerComponents)
            )

        if (alter.color !== null)
            comp.setColor(alter.color as ColorResolvable)

        return [
            comp
        ]
    }

    alterProxyTagsView(alter: PAlter) {
        return [
            new Container()
                .setComponents(
                    new TextDisplay()
                        .setContent(this.translations.ALTER_PROXY_TAGS.replace("%alter%", alter.username)),
                    new Separator(),
                    ...(
                        alter.proxyTags.map(
                            (v) => 
                                new Section()
                                    .setAccessory(
                                        new Button()
                                            .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.DeleteProxyTag.create(alter.alterId, v.id))
                                            .setStyle(ButtonStyle.Danger)
                                            .setLabel("Delete Proxy Tag")
                                    )
                                    .setComponents(
                                        new TextDisplay()
                                            .setContent(`${v.prefix}*text*${v.suffix}`)
                                    )
                        )
                    ),
                    new Separator(),
                    new ActionRow()
                        .setComponents(
                            new Button()
                                .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.CreateProxyTag.create(alter.alterId))
                                .setStyle(ButtonStyle.Primary)
                                .setLabel("Create New Proxy Tag")
                                .setDisabled(alter.proxyTags.length >= 7)
                        ),
                    new TextDisplay().setContent("-# You can create up to 6 proxy tags.")
                )
        ]
    }

    alterTopView(currentTab: "general" | "proxy-tags" | "public-settings", alterId: string, alterUsername: string) {
        return [

            new Container()
                .setComponents(
                    new TextDisplay()
                        .setContent(`-# @${alterUsername} • ID: \`${alterId}\``),
                    new ActionRow()
                        .setComponents(

                            new Button()
                                .setLabel("Back")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji(emojis.undo)
                                .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.Index.create(alterId)),
                            new Button()
                                .setLabel("General")
                                .setStyle(currentTab === "general" ? ButtonStyle.Success : ButtonStyle.Secondary)
                                .setEmoji(currentTab === "general" ? emojis.squareCheck : emojis.squareDashed)
                                .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.GeneralSettings.create(alterId)),
                            new Button()
                                .setLabel("Proxy Tags")
                                .setStyle(currentTab === "proxy-tags" ? ButtonStyle.Success : ButtonStyle.Secondary)
                                .setEmoji(currentTab === "proxy-tags" ? emojis.squareCheck : emojis.squareDashed)
                                .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.ProxyTagSettings.create(alterId)),
                            new Button()
                                .setLabel("Public Profile")
                                .setStyle(currentTab === "public-settings" ? ButtonStyle.Success : ButtonStyle.Secondary)
                                .setEmoji(currentTab === "public-settings" ? emojis.squareCheck : emojis.squareDashed)
                                .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.PublicProfileSettings.create(alterId))
                        )
                )
        ]
    }
}