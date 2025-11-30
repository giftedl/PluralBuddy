/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	Container,
	MediaGallery,
	MediaGalleryItem,
	Section,
	Separator,
	TextDisplay,
	Thumbnail,
} from "seyfert";
import { AlterProtectionFlags, type PAlter } from "../types/alter";
import { TranslatedView } from "./translated-view";
import type { ColorResolvable } from "seyfert/lib/common";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import { emojis } from "../lib/emojis";
import {
	friendlyProtectionAlters,
	friendlyProtectionSystem,
	has,
	listFromMaskAlters,
	listFromMaskSystems,
} from "@/lib/privacy-bitmask";
import { AlertView } from "./alert";

export class AlterView extends TranslatedView {
	alterProfileView(alter: PAlter, external = false) {
		if (external && !has(AlterProtectionFlags.VISIBILITY, alter.public)) {
			return new AlertView(this.translations).errorView("INVISIBLE_ALTER");
		}

		const displayNameDisplayable =
			!external || has(AlterProtectionFlags.NAME, alter.public);
		const pronounsDisplayable =
			!external || has(AlterProtectionFlags.PRONOUNS, alter.public);
		const descriptionDisplayable =
			!external || has(AlterProtectionFlags.DESCRIPTION, alter.public);
		const avatarDisplayable =
			!external || has(AlterProtectionFlags.AVATAR, alter.public);
		const bannerDisplayable =
			!external || has(AlterProtectionFlags.BANNER, alter.public);
		const messagesDisplayable =
			!external || has(AlterProtectionFlags.MESSAGE_COUNT, alter.public);
		const usernameDisplayable =
			!external || has(AlterProtectionFlags.USERNAME, alter.public);
		const tagsDisplayable =
			!external || has(AlterProtectionFlags.TAGS, alter.public);

		const innerComponents =
			new TextDisplay().setContent(`${displayNameDisplayable ? `## ${alter.displayName}` : ""}
${!displayNameDisplayable ? (usernameDisplayable ? `## @${alter.username}` : "") : usernameDisplayable ? `-# Also known as @${alter.username}` : ""} ${pronounsDisplayable && (alter.pronouns !== null && alter.pronouns !== undefined) ? `· ${alter.pronouns}` : ""}
${descriptionDisplayable && alter.description !== null ? "\n" : ""}${descriptionDisplayable ? (alter.description ?? "") : ""}${descriptionDisplayable && alter.description !== null ? "\n" : ""}
${messagesDisplayable ? `**Message Count:** ${alter.messageCount} ${alter.lastMessageTimestamp !== null ? `(last sent <t:${Math.floor(alter.lastMessageTimestamp?.getTime() / 1000)}:R>)` : ""}` : ""}
**Associated to:** <@${alter.systemId}> (${alter.systemId})\n
-# ID: \`${alter.alterId}\``);

		const comp = new Container().setComponents(
			!avatarDisplayable || alter.avatarUrl === null
				? innerComponents
				: new Section()
						.setAccessory(
							new Thumbnail()
								.setMedia(alter.avatarUrl as string)
								.setDescription(`${alter.avatarUrl}'s avatar`),
						)
						.setComponents(innerComponents),
			...(bannerDisplayable && alter.banner !== null
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
			new Container()
				.setComponents(
					new TextDisplay().setContent(
						this.translations.ALTER_GENERAL.replace(
							"%general%",
							emojis.settings,
						).replace("%alter%", alter.username),
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
					new Separator(),
					new Section()
						.addComponents(
							new TextDisplay().setContent(
								this.translations.ALTER_SET_PRIVACY_DESC +
									((alter.public ?? 0) > 0
										? `\n-# ${this.translations.CREATING_NEW_SYSTEM_PRIVACY_SET} \`${friendlyProtectionAlters(this.translations, listFromMaskAlters(alter.public ?? 0)).join("`, `")}\``
										: ""),
							),
						)
						.setAccessory(
							new Button()
								.setLabel(this.translations.ALTER_SET_PRIVACY)
								.setStyle(ButtonStyle.Secondary)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Alters.SetPrivacy.create(
										alter.alterId,
									),
								),
						),
				)
				.setColor("#1190FF"),
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
		prefix: string,
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
							InteractionIdentifier.Systems.Configuration.Alters.Index.create(),
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
