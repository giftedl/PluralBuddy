/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	Container,
	type Guild,
	MediaGallery,
	MediaGalleryItem,
	Section,
	Separator,
	TextDisplay,
	Thumbnail,
} from "seyfert";
import type { PAlter } from "../types/alter";
import { TranslatedView } from "./translated-view";
import type { ColorResolvable } from "seyfert/lib/common";
import type { PSystem } from "../types/system";
import { SystemSettingsView } from "./system-settings";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import { emojis } from "../lib/emojis";

export class AlterView extends TranslatedView {
	alterProfileView(alter: PAlter, preview = false) {
		const innerComponents =
			new TextDisplay().setContent(`${preview ? "" : "##"} ${alter.displayName} ${preview ? " - preview" : ""}
-# Also known as @${alter.username} ${(alter.pronouns !== null && alter.pronouns !== undefined) ? `· ${alter.pronouns}` : ""}
${alter.description !== null ? "\n" : ""}${alter.description ?? ""}${alter.description !== null ? "\n" : ""}
**Message Count:** ${alter.messageCount} ${alter.lastMessageTimestamp !== null ? `(last sent <t:${Math.floor(alter.lastMessageTimestamp?.getTime() / 1000)}:R>)` : ""}
**Associated to:** <@${alter.systemId}> (${alter.systemId})\n
-# ID: \`${alter.alterId}\``);

		const comp = new Container().setComponents(
			alter.avatarUrl === null
				? innerComponents
				: new Section()
						.setAccessory(
							new Thumbnail()
								.setMedia(alter.avatarUrl as string)
								.setDescription(`${alter.avatarUrl}'s avatar`),
						)
						.setComponents(innerComponents),
			...(alter.banner !== null
				? [
						new MediaGallery().setItems(
							new MediaGalleryItem()
								.setMedia(alter.banner)
								.setDescription(`${alter.avatarUrl}'s banner`),
						),
					]
				: []),
		);

		if (alter.color !== null && alter.color !== "#000000")
			comp.setColor(alter.color as ColorResolvable);

		return [comp];
	}

	alterProxyTagsView(alter: PAlter) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(
					this.translations.ALTER_PROXY_TAGS.replace("%alter%", alter.username),
				),
				new Separator(),
				...alter.proxyTags.map((v) =>
					new Section()
						.setAccessory(
							new Button()
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Alters.DeleteProxyTag.create(
										alter.alterId,
										v.id,
									),
								)
								.setStyle(ButtonStyle.Danger)
								.setLabel("Delete Proxy Tag"),
						)
						.setComponents(
							new TextDisplay().setContent(`${v.prefix}*text*${v.suffix}`),
						),
				),
				new Separator(),
				new ActionRow().setComponents(
					new Button()
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Alters.CreateProxyTag.create(
								alter.alterId,
							),
						)
						.setStyle(ButtonStyle.Primary)
						.setLabel("Create New Proxy Tag")
						.setDisabled(alter.proxyTags.length >= 7),
				),
				new TextDisplay().setContent("-# You can create up to 6 proxy tags."),
			),
		];
	}

	alterGeneralView(alter: PAlter) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(
					this.translations.ALTER_GENERAL.replace("%alter%", alter.username),
				),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.ALTER_SET_USERNAME_DESC,
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_USERNAME)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetUsername.create(
									alter.alterId,
								),
							),
					),
				new Separator(),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							`${this.translations.ALTER_SET_MODE_DESC}
-# Current mode for @${alter.username} is ${alter.alterMode[0]?.toUpperCase() + alter.alterMode.slice(1)}`,
						),
					)
					.setAccessory(
						new Button()
							.setLabel(this.translations.ALTER_SET_MODE)
							.setStyle(ButtonStyle.Secondary)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetProxyMode.create(
									alter.alterId,
								),
							),
					),
			),
		];
	}

	altersSetMode(alterUsername: string, alterId: number, currentMode: string) {
		return [
			new Container()
				.setComponents(
					new TextDisplay().setContent(`### ${emojis.circleQuestion}   Proxy Mode · @${alterUsername}
${this.translations.ALTER_SET_MODE_DESC}

Please select the mode you would like to use below.
-# Current mode for @${alterUsername} is ${currentMode[0]?.toUpperCase() + currentMode.slice(1)}`),
				)
				.setColor("#1190FF"),
			new ActionRow().setComponents(
				new Button()
					.setEmoji(emojis.undo)
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.GoBack.create(
							alterId,
						),
					)
					.setLabel("Back")
					.setStyle(ButtonStyle.Secondary),
				new Button()
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.Nickname.create(
							alterId,
						),
					)
					.setLabel("Nickname")
					.setStyle(ButtonStyle.Primary),
				new Button()
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.Webhook.create(
							alterId,
						),
					)
					.setLabel("Webhook")
					.setStyle(ButtonStyle.Primary),
				new Button()
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.Both.create(
							alterId,
						),
					)
					.setLabel("Both")
					.setStyle(ButtonStyle.Primary),
			),
		];
	}

	altersPublicView(
		alter: PAlter,
		currentGuildName: { name: string; id: string },
		prefix: string
	) {
		const existingName = alter.nameMap.find(
			(v) => currentGuildName.id === v.server,
		);

		return [
			new Container().setComponents(
				new TextDisplay().setContent(
					`## Public Profile - @${alter.username}\nYour public profile is what your alter looks like to other users when they identify your messages.`,
				),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							`Display names are shown on webhooks when you proxy. These have less restrictions then usernames.\n-# Display Name: ${alter.displayName}`,
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_DISPLAY)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetDisplayName.create(
									alter.alterId,
								),
							),
					),
				...(currentGuildName.name !== ""
					? [
							new Separator().setSpacing(Spacing.Large),
							new Section()
								.addComponents(
									new TextDisplay().setContent(
										this.translations.ALTER_SET_SERVER_NAME_DESC.replaceAll(
											"%server%",
											`**${currentGuildName.name}**`,
										).replaceAll(
											"%name%",
											existingName?.name ?? alter.displayName,
										),
									),
								)
								.setAccessory(
									new Button()
										.setStyle(ButtonStyle.Secondary)
										.setLabel(this.translations.ALTER_SET_SERVER_NAME)
										.setCustomId(
											InteractionIdentifier.Systems.Configuration.Alters.SetServerDisplayName.create(
												alter.alterId,
											),
										),
								),
						]
					: []),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							"You can set a **profile picture** by uploading an image using the modal on the right.",
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_PFP)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetPFP.create(
									alter.alterId,
								),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							"You can set a **banner** by uploading an image using the modal on the right.",
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_BANNER)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetBanner.create(
									alter.alterId,
								),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							`You can set pronouns for your alter. Alter pronouns can be at maximum 100 characters long.
-# @${alter.username}'s pronouns are: ${alter.pronouns ?? "Not set"}`,
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_PRONOUNS)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetPronouns.create(
									alter.alterId,
								),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							`You can set a description for your alter. Alter descriptions can be at maximum 2,000 characters long.
-# To view your description in full, run: \`${prefix}edit-alter description ${alter.username}\``,
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_DESCRIPTION)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetDescription.create(
									alter.alterId,
								),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							"Setting a color for an alter shows that color for their rank container along with their public profile.",
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_COLOR)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetAlterColor.create(
									alter.alterId,
								),
							),
					),
			),
		];
	}

	alterTopView(
		currentTab: "general" | "proxy-tags" | "public-settings",
		alterId: string,
		alterUsername: string,
	) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(
					`-# @${alterUsername} • ID: \`${alterId}\``,
				),
				new ActionRow().setComponents(
					new Button()
						.setLabel("Back")
						.setStyle(ButtonStyle.Secondary)
						.setEmoji(emojis.undo)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Alters.Index.create(
								alterId,
							),
						),
					new Button()
						.setLabel("General")
						.setStyle(
							currentTab === "general"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "general"
								? emojis.squareCheck
								: emojis.squareDashed,
						)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Alters.GeneralSettings.create(
								alterId,
							),
						),
					new Button()
						.setLabel("Proxy Tags")
						.setStyle(
							currentTab === "proxy-tags"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "proxy-tags"
								? emojis.squareCheck
								: emojis.squareDashed,
						)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Alters.ProxyTagSettings.create(
								alterId,
							),
						),
					new Button()
						.setLabel("Public Profile")
						.setStyle(
							currentTab === "public-settings"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "public-settings"
								? emojis.squareCheck
								: emojis.squareDashed,
						)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Alters.PublicProfileSettings.create(
								alterId,
							),
						),
				),
			),
		];
	}

	alterConfigureButton(alter: PAlter) {
		return [
			new ActionRow().setComponents(
				new Button()
					.setLabel("Configure Profile")
					.setEmoji(emojis.wrenchWhite)
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ConfigureAlterExternal.create(
							alter.alterId,
						),
					)
					.setStyle(ButtonStyle.Primary),
			),
		];
	}
}
