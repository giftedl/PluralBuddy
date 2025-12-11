/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import type { Guild } from "seyfert";
import { client } from "..";
import type { PSystem } from "@/types/system";
import { ActionRow, Button, Container, Section } from "seyfert";
import { TextDisplay } from "seyfert";
import type { TranslationString } from "@/lang";
import { emojis } from "./emojis";
import { InteractionIdentifier } from "./interaction-ids";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";

export async function sendAutoproxyOperationDM(
	system: PSystem,
	changedServer: Guild<"cached" | "api">,
	translations: TranslationString,
	environment: "discord" | "web",
	mode: "off" | "latch" | "alter",
) {
	await client.users.write(system.associatedUserId, {
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
									InteractionIdentifier.Systems.AutoProxy.Off.create(
										changedServer.id,
									),
								)
								.setLabel("Disable Auto Proxy")
								.setEmoji(emojis.undo)
								.setStyle(ButtonStyle.Primary),
						)
						.setComponents(
							new TextDisplay().setContent(
								`- Switched auto-proxy mode to ${mode}.`,
							),
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
		],
	});
}
