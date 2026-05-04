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
import { w } from "@/webhooks";

export async function sendAutoproxyOperationDM(
	system: PSystem,
	changedServer: Guild<"cached" | "api">,
	translations: TranslationString,
	environment: "discord" | "web",
	mode: "off" | "latch" | "alter",
	proxyAlter?: number,
) {
	w(system.associatedUserId, "system.update", {
		system: {
			...system,
			systemAutoproxy: [
				...system.systemAutoproxy.filter(
					(v) => v.serverId !== changedServer.id,
				),
				{
					serverId: changedServer.id,
					autoproxyMode: mode,
					autoproxyAlter: proxyAlter ? proxyAlter?.toString() : undefined,
				},
			],
		} satisfies PSystem,
	});

	if (system.systemOperationDM)
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
						new Section()
							.setComponents(
								new TextDisplay().setContent(
									"-# You were notified of this action due to your association with your PluralBuddy system's auto-proxy settings.",
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
				})
				.catch(() => null);
		} catch (_) {}
}
