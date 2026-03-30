/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	Container,
	MediaGallery,
	MediaGalleryItem,
	Section,
	Separator,
	StringSelectMenu,
	StringSelectOption,
	TextDisplay,
	Thumbnail,
} from "seyfert";
import { AlterProtectionFlags, type PAlter } from "../types/alter";
import { TranslatedView } from "./translated-view";
import type { ColorResolvable } from "seyfert/lib/common";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import { emojis, getEmojiFromTagColor } from "../lib/emojis";
import {
	friendlyProtectionAlters,
	friendlyProtectionSystem,
	has,
	listFromMaskAlters,
	listFromMaskSystems,
} from "@/lib/privacy-bitmask";
import { AlertView } from "./alert";
import { mentionCommand } from "@/lib/mention-command";
import { tagCollection } from "@/mongodb";
import type { PTag } from "@/types/tag";
import type { PSystem } from "@/types/system";
import { getUserById } from "@/types/user";
import type { PGuild } from "plurography";
import { sanitizeEmojis } from "@/lib/sanitize-emojis";

export class AlterView extends TranslatedView {
	private async getTags(alter: PAlter) {
		return {
			data: await tagCollection
				.find({ associatedAlters: alter.alterId.toString().toString() })
				.limit(5)
				.toArray(),
			count: alter.tagIds.length,
		};
	}

	async alterProfileView(alter: PAlter, external = false) {
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
		const sanitizedDescription = await sanitizeEmojis(alter.description ?? "");

		setTimeout(() => sanitizedDescription.postHook(), 3000);

		let tags: PTag[] = [];
		let tagCount = 0;
		if (tagsDisplayable) {
			const { data, count } = await this.getTags(alter);

			tags = data;
			tagCount = count;
		}

		const innerComponents =
			new TextDisplay().setContent(`${displayNameDisplayable ? `## ${alter.displayName}` : ""}
${!displayNameDisplayable ? (usernameDisplayable ? `## @${alter.username}` : "") : usernameDisplayable ? this.translations.AKA_PROFILE.replace("{{ username }}", alter.username) : ""} ${pronounsDisplayable && (alter.pronouns !== null && alter.pronouns !== undefined) ? `· ${alter.pronouns}` : ""}
${descriptionDisplayable && alter.description !== null ? "\n" : ""}${descriptionDisplayable ? sanitizedDescription.result : ""}${descriptionDisplayable && alter.description !== null ? "\n" : ""}
${messagesDisplayable ? `${this.translations.MESSAGE_COUNT_LABEL_PROFILE}${alter.messageCount} ${alter.lastMessageTimestamp !== null ? this.translations.LAST_SENT_TIME_PROFILE.replace("{{ timestamp }}", `<t:${Math.floor(alter.lastMessageTimestamp?.getTime() / 1000)}:R>`) : ""}` : ""}
${this.translations.OWNED_BY_PROFILE}<@${alter.systemId}> (${alter.systemId})
${tags.length !== 0 ? `${this.translations.TAGS_PROFILE}${tags.map((tag) => `${getEmojiFromTagColor(tag.tagColor)}  ${tag.tagFriendlyName}`).join(",  ")}${tags.length !== tagCount ? this.translations.LIST_MORE_PROFILE.replace("{{ length }}", String(tagCount - tags.length)) : ""}\n` : ""}
${this.translations.ID_SMALL_PROFILE}\`${alter.alterId.toString()}\``);

		const comp = new Container().setComponents(
			!avatarDisplayable || alter.avatarUrl === null
				? innerComponents
				: new Section()
						.setAccessory(
							new Thumbnail()
								.setMedia(
									alter.avatarUrl === ""
										? "https://pb.giftedly.dev/image/solar-centered.png"
										: alter.avatarUrl,
								)
								.setDescription(
									this.translations.ALT_AVATAR.replace(
										"{{ alter }}",
										alter.alterId.toString(),
									),
								),
						)
						.setComponents(innerComponents),
			...(bannerDisplayable && alter.banner !== null
				? [
						new MediaGallery().setItems(
							new MediaGalleryItem()
								.setMedia(
									alter.banner === ""
										? "https://pb.giftedly.dev/image/solar-centered.png"
										: alter.banner,
								)
								.setDescription(
									this.translations.ALT_BANNER.replace(
										"{{ alter }}",
										alter.alterId.toString(),
									),
								),
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
										alter.alterId.toString(),
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
								alter.alterId.toString(),
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

	async alterGeneralView(alter: PAlter, guildId: string | undefined) {
		const user = await getUserById(alter.systemId);
		const system = user.system;

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
										alter.alterId.toString(),
									),
								),
						),
					new Separator(),
					new Section()
						.addComponents(
							new TextDisplay().setContent(
								`${this.translations.ALTER_SET_MODE_DESC}
${this.translations.CURRENT_PROXY_MODE.replace("{{ username }}", alter.username).replace("{{ proxyMode }}", alter.alterMode[0]?.toUpperCase() + alter.alterMode.slice(1))}`,
							),
						)
						.setAccessory(
							new Button()
								.setLabel(this.translations.ALTER_SET_MODE)
								.setStyle(ButtonStyle.Secondary)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Alters.SetProxyMode.create(
										alter.alterId.toString(),
									),
								),
						),
					new Separator(),
					new Section()
						.addComponents(
							new TextDisplay().setContent(this.translations.UNLIMITED_ASSIGN),
						)
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.TAG_ASSIGN_ALTER)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Tags.AssignAlter.create(
										alter.alterId.toString(),
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
										alter.alterId.toString(),
									),
								),
						),
					new Separator(),
					new TextDisplay().setContent(`${this.translations.AP_EXPLANATION}
 
${system == null || system.systemAutoproxy.some((a) => a.serverId === guildId && a.autoproxyMode !== "off") ? `**Current auto-proxy mode:** ${system?.systemAutoproxy.find((a) => a.serverId)?.autoproxyMode} as ${(system?.systemAutoproxy.find((a) => a.serverId)?.autoproxyAlter ?? "0") === alter.alterId.toString() ? "*this alter*" : "*another alter*"}` : ``}`),

					new ActionRow().setComponents(
						new StringSelectMenu()
							.setPlaceholder(
								guildId === undefined
									? this.translations.REQUIRED_SERVER_PROXY
									: this.translations.SELECT_DEFAULT_PROXY,
							)
							.setCustomId(InteractionIdentifier.AutoProxy.AlterMenu.create())
							.setDisabled(guildId === undefined)
							.setOptions([
								new StringSelectOption()
									.setValue(
										InteractionIdentifier.Selection.AutoProxyModes.Latch.create(
											alter.alterId,
										),
									)
									.setLabel(this.translations.LATCH_NAME)
									.setDescription(this.translations.LATCH_DESC)
									.setDefault(
										system?.systemAutoproxy.some(
											(a) =>
												a.serverId === guildId && a.autoproxyMode === "latch",
										),
									),
								new StringSelectOption()
									.setValue(
										InteractionIdentifier.Selection.AutoProxyModes.Alter.create(
											alter.alterId,
										),
									)
									.setLabel(this.translations.ALTER_AP_NAME)
									.setDescription(
										this.translations.ALTER_AP_DESC,
									)
									.setDefault(
										system?.systemAutoproxy.some(
											(a) =>
												a.serverId === guildId &&
												a.autoproxyMode === "alter" &&
												a.autoproxyAlter === alter.alterId.toString(),
										),
									),
								new StringSelectOption()
									.setValue(
										InteractionIdentifier.Selection.AutoProxyModes.Off.create(),
									)
									.setLabel(this.translations.OFF_NAME)
									.setDescription(this.translations.OFF_DESC)
									.setDefault(
										system?.systemAutoproxy.some(
											(a) =>
												a.serverId === guildId && a.autoproxyMode === "off",
										),
									),
							]),
					),
					new Separator(),
					new Section()
						.addComponents(
							new TextDisplay().setContent(this.translations.DELETE_DESC),
						)
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Danger)
								.setLabel(this.translations.DELETE_ALTER)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Alters.DeleteAlter.create(
										alter.alterId.toString(),
									),
								),
						),
				)
				.setColor("#1190FF"),
		];
	}

	altersSetMode(
		alterUsername: string,
		alterId: number,
		currentMode: string,
		guild: PGuild,
	) {
		return [
			new Container()
				.setComponents(
					new TextDisplay().setContent(`${this.translations.PROXY_MODE_TITLE.replace("{{ circleQuestion }}", emojis.circleQuestion).replace("{{ alterUsername }}", alterUsername)}
${this.translations.ALTER_SET_MODE_DESC}

${this.translations.SELECT_PM}
${this.translations.CURRENT_PROXY_MODE.replace("{{ username }}", alterUsername).replace("{{ proxyMode }}", currentMode[0]?.toUpperCase() + currentMode.slice(1))}`),
				)
				.setColor("#1190FF"),
			...(guild.getFeatures().forcedNicknameMode ||
			guild.getFeatures().forcedWebhookMode
				? [
						new Container()
							.setComponents(
								new TextDisplay().setContent(
									this.translations.FORCED_WEBHOOK_WARNING.replace(
										"{{ x }}",
										emojis.x,
									).replaceAll(
										"{{ policyType }}",
										guild.getFeatures().forcedNicknameMode
											? this.translations.POLICY_TYPE_NICK
											: this.translations.POLICY_TYPE_WEBHOOK,
									),
								),
							)
							.setColor("#B70000"),
					]
				: []),
			new ActionRow().setComponents(
				new Button()
					.setEmoji(emojis.undo)
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.GoBack.create(
							alterId.toString(),
						),
					)
					.setLabel(this.translations.OPTION_BACK)
					.setStyle(ButtonStyle.Secondary),
				new Button()
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.Nickname.create(
							alterId.toString(),
						),
					)
					.setLabel(this.translations.OPTION_NICKNAME)
					.setStyle(ButtonStyle.Primary),
				new Button()
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.Webhook.create(
							alterId,
						),
					)
					.setLabel(this.translations.OPTION_WEBHOOK)
					.setStyle(ButtonStyle.Primary),
				new Button()
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.Both.create(
							alterId,
						),
					)
					.setLabel(this.translations.OPTION_BOTH)
					.setStyle(ButtonStyle.Primary),
			),
		];
	}

	altersPublicView(
		alter: PAlter,
		currentGuildName: { name: string; id: string },
		prefix: string,
		isApplication: boolean,
	) {
		const existingName = alter.nameMap.find(
			(v) => currentGuildName.id === v.server,
		);

		return [
			new Container().setComponents(
				new TextDisplay().setContent(
					this.translations.PUBLIC_PROFILE_TITLE.replace(
						"{{ alterUsername }}",
						alter.username,
					),
				),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.PUBLIC_PROFILE_DN_DESC.replace(
								"{{ currentDisplayName }}",
								alter.displayName,
							),
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_DISPLAY)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetDisplayName.create(
									alter.alterId.toString(),
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
												alter.alterId.toString(),
											),
										),
								),
						]
					: []),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.PUBLIC_PROFILE_PFP_DESC,
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_PFP)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetPFP.create(
									alter.alterId.toString(),
								),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.PUBLIC_PROFILE_BANNER_DESC,
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_BANNER)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetBanner.create(
									alter.alterId.toString(),
								),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.PUBLIC_PROFILE_PN_DESC.replace(
								"{{ alterUsername }}",
								alter.username,
							).replace(
								"{{ alterPronouns }}",
								alter.pronouns ?? this.translations.PUBLIC_PROFILE_UNSET_PN,
							),
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_PRONOUNS)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetPronouns.create(
									alter.alterId.toString(),
								),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.PUBLIC_PROFILE_DESC_DESC.replace(
								"{{ commandMention }}",
								mentionCommand(
									prefix,
									"edit-alter description",
									isApplication,
									alter.username,
								),
							),
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_DESCRIPTION)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetDescription.create(
									alter.alterId.toString(),
								),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.PUBLIC_PROFILE_COLOR_DESC,
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_COLOR)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.Alters.SetAlterColor.create(
									alter.alterId.toString(),
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
					this.translations.ALTER_TOP_VIEW.replace(
						"{{ alterUsername }}",
						alterUsername,
					).replace("{{ alterId }}", alterId),
				),
				new ActionRow().setComponents(
					new Button()
						.setLabel(this.translations.TOP_BACK_LABEL)
						.setStyle(ButtonStyle.Secondary)
						.setEmoji(emojis.undo)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Alters.Index.create(),
						),
					new Button()
						.setLabel(this.translations.GENERAL_LABEL)
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
						.setLabel(this.translations.ALTER_PROXY_TAGS_LABEL)
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
						.setLabel(this.translations.PUBLIC_PROFILE_LABEL)
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
					.setLabel(this.translations.CONFIGURE_PROFILE_BTN)
					.setEmoji(emojis.wrenchWhite)
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Alters.ConfigureAlterExternal.create(
							alter.alterId.toString(),
						),
					)
					.setStyle(ButtonStyle.Primary),
			),
		];
	}

	alterProxyModes(alter: PAlter, guildId: string | undefined) {
		return [
			new ActionRow().setComponents(
				new StringSelectMenu()
					.setPlaceholder(
						guildId === undefined
							? this.translations.REQUIRED_SERVER_PROXY
							: this.translations.SELECT_DEFAULT_PROXY,
					)
					.setCustomId(InteractionIdentifier.AutoProxy.AlterMenu.create())
					.setDisabled(guildId === undefined)
					.setOptions([
						new StringSelectOption()
							.setValue(
								InteractionIdentifier.Selection.AutoProxyModes.Latch.create(
									alter.alterId,
								),
							)
							.setLabel(this.translations.LATCH_NAME)
							.setDescription(
								this.translations.LATCH_DESC,
							),
						new StringSelectOption()
							.setValue(
								InteractionIdentifier.Selection.AutoProxyModes.Alter.create(
									alter.alterId,
								),
							)
							.setLabel(this.translations.ALTER_NAME)
							.setDescription(
								this.translations.ALTER_DESC,
							),
						new StringSelectOption()
							.setValue(
								InteractionIdentifier.Selection.AutoProxyModes.Off.create(),
							)
							.setLabel(this.translations.OFF_NAME)
							.setDescription(this.translations.OFF_DESC),
					]),
			),
		];
	}
}
