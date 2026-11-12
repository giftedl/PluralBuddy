/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { Guild } from "seyfert";
import { ActionRow, Button, Container, Section, TextDisplay } from "seyfert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import type { TranslationString } from "@/lang";
import type { PSystem } from "@/types/system";
import { client } from "..";
import { emojis } from "./emojis";
import { InteractionIdentifier } from "./interaction-ids";

export async function sendAutoproxyOperationDM(
  system: PSystem,
  changedServer: Guild<"cached" | "api">,
  translations: TranslationString,
  environment: "discord" | "web",
  mode: string,
) {
  if (!system.systemOperationDM)
    try {
      await client.users
        .write(system.associatedUserId, {
          flags: MessageFlags.IsComponentsV2,
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
                        InteractionIdentifier.Systems.AutoProxy.Off.create(changedServer.id),
                      )
                      .setLabel("Disable Auto Proxy")
                      .setEmoji(emojis.undo)
                      .setStyle(ButtonStyle.Primary),
                  )
                  .setComponents(
                    new TextDisplay().setContent(`- Switched auto-proxy mode to ${mode}.`),
                  ),
                new TextDisplay().setContent(
                  `-# ${
                    environment === "discord"
                      ? translations.OPERATION_DISCORD_AP.replace(
                          "%server_name%",
                          changedServer.name,
                        )
                          .replace("%server_id%", changedServer.id)
                          .replace("%discord%", emojis.discord)
                      : /** TODO: API stuff */ ""
                  }`,
                ),
              )
              .setColor("#F9DC00"),
            new Section()
              .setComponents(
                new TextDisplay().setContent(
                  "-# You were notified of this action due to your association with your PluralBuddy system's auto-proxy settings.",
                ),
                new TextDisplay().setContent(
                  "-# Developed as open-source software @ [pluralbuddy.app](<https://pluralbuddy.app>)",
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
        })
        .catch(() => null);
    } catch (_) {}
}
