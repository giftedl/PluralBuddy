/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	Container,
	Section,
	SelectMenu,
	Separator,
	StringSelectMenu,
	StringSelectOption,
	TextDisplay,
} from "seyfert";
import { TranslatedView } from "./translated-view";
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import { InteractionIdentifier } from "../lib/interaction-ids";
import type { PSystem } from "../types/system";
import { emojis, getEmojiFromTagColor } from "../lib/emojis";
import {
	friendlyProtectionSystem,
	has,
	listFromMaskSystems,
} from "../lib/privacy-bitmask";
import { alterCollection, tagCollection } from "@/mongodb";
import type { FindCursor, WithId } from "mongodb";
import { AlterProtectionFlags, type PAlter } from "@/types/alter";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { AlertView } from "./alert";
import { mentionCommand } from "@/lib/mention-command";

export const alterPagination: {
	id: string;
	memoryPage: number;
	documentCount: number;
	searchQuery?: string | undefined;
	queryType?: "username" | "display-name" | undefined;
}[] = [];
export const otherAlterPagination: {
	id: string;
	memoryPage: number;
	documentCount: number;
	searchQuery?: string | undefined;
	queryType?: "username" | "display-name" | undefined;
	userId: string;
}[] = [];

export const tagsPagination: {
	id: string;
	memoryPage: number;
	documentCount: number;
	searchQuery?: string | undefined;
}[] = [];
export class SystemSettingsView extends TranslatedView {
	topView(
		currentTab: "general" | "alters" | "tags" | "public-settings",
		systemId: string,
	) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(`-# ID: \`${systemId}\``),
				new ActionRow().setComponents(
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
							InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create(),
						),
					new Button()
						.setLabel(this.translations.ALTERS_LABEL)
						.setStyle(
							currentTab === "alters"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "alters"
								? emojis.squareCheck
								: emojis.squareDashed,
						)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Alters.Index.create(),
						),
					new Button()
						.setLabel(this.translations.TAGS_LABEL)
						.setStyle(
							currentTab === "tags"
								? ButtonStyle.Success
								: ButtonStyle.Secondary,
						)
						.setEmoji(
							currentTab === "tags" ? emojis.squareCheck : emojis.squareDashed,
						)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Tags.Index.create(),
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
							InteractionIdentifier.Systems.Configuration.PublicProfile.Index.create(),
						),
				),
			),
		];
	}

	generalSettings(system: PSystem, guildId: string | undefined) {
		return [
			new Container()
				.setComponents(
					new TextDisplay().setContent(
						this.translations.GENERAL_SYSTEM_TITLE.replace(
							"{{ emoji }}",
							emojis.settings,
						).replace("{{ systemName }}", system.systemName),
					),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.SYSTEM_NAME_BTN)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.SetName.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(this.translations.SYSTEM_NAME_DESC),
						),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.SYSTEM_NICKNAME_FORMAT_BTN)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.SetNicknameFormat.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(
								this.translations.SYSTEM_NICKNAME_FORMAT_DESC,
							),
						),
					new Separator(),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.SYSTEM_PRIVACY_BTN)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.SetPrivacy.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(
								// biome-ignore lint/style/useTemplate: a
								this.translations.SYSTEM_PRIVACY_DESC +
									((system.public ?? 0) > 0
										? `\n-# ${this.translations.CREATING_NEW_SYSTEM_PRIVACY_SET} \`${friendlyProtectionSystem(this.translations, listFromMaskSystems(system.public ?? 0)).join("`, `")}\``
										: ""),
							),
						),

					new TextDisplay().setContent(this.translations.SYSTEM_AP_DESC),

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
										InteractionIdentifier.Selection.AutoProxyModes.Latch.create(),
									)
									.setLabel(this.translations.LATCH_NAME)
									.setDescription(this.translations.LATCH_DESC)
									.setDefault(
										system.systemAutoproxy.some(
											(a) =>
												a.serverId === guildId && a.autoproxyMode === "latch",
										),
									),
								new StringSelectOption()
									.setValue("--")
									.setLabel(this.translations.ALTER_NAME)
									.setDescription(this.translations.ALTER_DESC_DISABLED)
									.setDefault(
										system.systemAutoproxy.some(
											(a) =>
												a.serverId === guildId && a.autoproxyMode === "alter",
										),
									),
								new StringSelectOption()
									.setValue(
										InteractionIdentifier.Selection.AutoProxyModes.Off.create(),
									)
									.setLabel(this.translations.OFF_NAME)
									.setDescription(this.translations.OFF_DESC)
									.setDefault(
										system.systemAutoproxy.some(
											(a) =>
												a.serverId === guildId && a.autoproxyMode === "off",
										),
									),
							]),
					),
					new Separator(),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.EXPORT_SYS_BTN)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.ExportSystem.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(this.translations.EXPORT_SYS_DESC),
						),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.IMPORT_SYS_BTN)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.ImportSystem.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(this.translations.IMPORT_SYS_DESC),
						),
				)
				.setColor("#1190FF"),
			new Container()
				.setColor("#FF1717")
				.setSpoiler(true)
				.setComponents(
					new TextDisplay().setContent(this.translations.DANGER_ZONE_TITLE),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(
									system.disabled ? ButtonStyle.Primary : ButtonStyle.Danger,
								)
								.setLabel(
									system.disabled
										? this.translations.SYSTEM_E
										: this.translations.SYSTEM_D,
								)
								.setCustomId(
									InteractionIdentifier.Systems.ToggleDisableSystem.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(this.translations.SYSTEM_D_DESC),
						),
					new Separator(),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Danger)
								.setLabel(this.translations.DELETE_SYS_BTN)
								.setCustomId(
									InteractionIdentifier.Setup.RemoveOldSystem.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(this.translations.DELETE_SYS_DESC),
						),
				),
		];
	}
	async otherAltersSettings(
		system: PSystem,
		pgObj?: (typeof alterPagination)[0],
	) {
		const altersPerPage = 5;

		if (system.alterIds.length === 0) {
			return [...new AlertView(this.translations).errorView("ERROR_NO_ALTERS")];
		}

		const time = Date.now();
		const altersCursor = alterCollection
			.find({
				systemId: system.associatedUserId,
				...(pgObj?.queryType === "display-name"
					? { displayName: { $regex: pgObj?.searchQuery ?? "" } }
					: pgObj?.queryType === "username"
						? { username: { $regex: pgObj?.searchQuery ?? "" } }
						: {}),
			})
			.sort({ username: 1 })
			.limit(altersPerPage)
			.skip(((pgObj?.memoryPage ?? 1) - 1) * altersPerPage);

		const alters = await altersCursor.toArray();
		const pgId = pgObj === undefined ? DiscordSnowflake.generate() : pgObj.id;

		if (pgObj === undefined) {
			const documentCount = await alterCollection.countDocuments({
				systemId: system.associatedUserId,
			});

			otherAlterPagination.push({
				id: String(pgId),
				memoryPage: 1,
				documentCount,
				userId: system.associatedUserId,
			});

			pgObj = {
				id: String(pgId),
				memoryPage: 1,
				documentCount,
			};
		}

		return [
			new Container().setComponents(
				new TextDisplay().setContent(this.translations.ALTERS_TITLE),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					alters
						.filter((v) => has(AlterProtectionFlags.VISIBILITY, v.public))
						.map(
							(alter) =>
								`[\`@${has(AlterProtectionFlags.USERNAME, alter.public) ? alter.username : "••••••"}\`] **${has(AlterProtectionFlags.NAME, alter.public) ? alter.displayName : "••••••••"}${alter.pronouns !== null && alter.pronouns !== undefined && has(AlterProtectionFlags.PRONOUNS, alter.public) ? ` | ${alter.pronouns}` : ""}**`,
						)
						.join("\n") +
						(alters.filter((v) =>
							has(AlterProtectionFlags.VISIBILITY, v.public),
						).length === 0
							? this.translations.NO_PUBLIC_ALTERS_DESC
							: ""),
				),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					this.translations.ALTERS_PAGINATION.replace(
						"{{ page }}",
						String(pgObj.memoryPage),
					)
						.replace(
							"{{ maxPage }}",
							String(Math.ceil((pgObj?.documentCount ?? 0) / altersPerPage)),
						)
						.replace("{{ alters }}", String(alters.length))
						.replace("{{ maxAlters }}", String(pgObj.documentCount))
						.replace("{{ time }}", String(Date.now() - time))
						.replace(
							"{{ possibleSearchQuery }}",
							pgObj.searchQuery !== undefined
								? this.translations.ALTERS_POSSIBLE_SQ.replace(
										"{{ query }}",
										`\`${pgObj.searchQuery}\` (${pgObj.queryType?.replaceAll("-", " ")})`,
									)
								: "",
						),
				),
				new ActionRow().setComponents(
					new Button()
						.setLabel(this.translations.PAGINATION_PREVIOUS_PAGE)
						.setDisabled(pgObj?.memoryPage === 1)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.OtherAlterPagination.PreviousPage.create(
								pgObj.id,
							),
						)
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setLabel(this.translations.PAGINATION_NEXT_PAGE)
						.setDisabled(
							pgObj?.memoryPage ===
								Math.ceil((pgObj?.documentCount ?? 0) / altersPerPage),
						)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.OtherAlterPagination.NextPage.create(
								pgObj.id,
							),
						)
						.setStyle(ButtonStyle.Primary),

					new Button()
						.setStyle(ButtonStyle.Primary)
						.setEmoji(emojis.search)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.OtherAlterPagination.Search.create(
								pgObj.id,
							),
						),
				),
			),
		];
	}

	async altersSettings(system: PSystem, pgObj?: (typeof alterPagination)[0]) {
		const altersPerPage = 5;

		if (system.alterIds.length === 0) {
			return [
				...this.topView("alters", system.associatedUserId),
				...new AlertView(this.translations).errorView("ERROR_NO_ALTERS"),
				new ActionRow().setComponents(
					new Button()
						.setLabel(this.translations.CREATE_NEW_ALTER_DESCRIPTION)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPagination.CreateNewAlter.create(),
						)
						.setStyle(ButtonStyle.Primary),
				),
			];
		}

		const time = Date.now();
		const altersCursor = alterCollection
			.find({
				systemId: system.associatedUserId,
				...(pgObj?.queryType === "display-name"
					? { displayName: { $regex: pgObj?.searchQuery ?? "" } }
					: pgObj?.queryType === "username"
						? { username: { $regex: pgObj?.searchQuery ?? "" } }
						: {}),
			})
			.sort({ username: 1 })
			.limit(altersPerPage)
			.skip(((pgObj?.memoryPage ?? 1) - 1) * altersPerPage);

		const alters = await altersCursor.toArray();
		const pgId = pgObj === undefined ? DiscordSnowflake.generate() : pgObj.id;

		if (pgObj === undefined) {
			const documentCount = await alterCollection.countDocuments({
				systemId: system.associatedUserId,
			});

			alterPagination.push({
				id: String(pgId),
				memoryPage: 1,
				documentCount,
			});

			pgObj = {
				id: String(pgId),
				memoryPage: 1,
				documentCount,
			};
		}

		return [
			...this.topView("alters", system.associatedUserId),
			new Container().setComponents(
				new TextDisplay().setContent(
					`${this.translations.ALTERS_TITLE} - ${system.systemName}`,
				),
				new Separator().setSpacing(Spacing.Large),
				...alters.map((alter) => {
					return new Section()
						.setAccessory(
							new Button()
								.setLabel(this.translations.ALTER_EDIT)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.ConfigureAlter.create(
										alter.alterId,
									),
								)
								.setStyle(ButtonStyle.Primary)
								.setEmoji(emojis.wrenchWhite),
						)
						.setComponents(
							new TextDisplay().setContent(
								`[\`@${alter.username}\`] **${alter.displayName}${alter.pronouns !== null && alter.pronouns !== undefined ? ` | ${alter.pronouns}` : ""}** ${alter.proxyTags[0] !== undefined ? `*(*\`"${alter.proxyTags[0].prefix}text${alter.proxyTags[0].suffix}"\`*)*` : ""}`,
							),
						);
				}),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					this.translations.ALTERS_PAGINATION.replace(
						"{{ page }}",
						String(pgObj.memoryPage),
					)
						.replace(
							"{{ maxPage }}",
							String(Math.ceil((pgObj?.documentCount ?? 0) / altersPerPage)),
						)
						.replace("{{ alters }}", String(alters.length))
						.replace("{{ maxAlters }}", String(pgObj.documentCount))
						.replace("{{ time }}", String(Date.now() - time))
						.replace(
							"{{ possibleSearchQuery }}",
							pgObj.searchQuery !== undefined
								? this.translations.ALTERS_POSSIBLE_SQ.replace(
										"{{ query }}",
										`\`${pgObj.searchQuery}\` (${pgObj.queryType?.replaceAll("-", " ")})`,
									)
								: "",
						),
				),
				new ActionRow().setComponents(
					new Button()
						.setEmoji(emojis.plus)
						.setStyle(ButtonStyle.Primary)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPagination.CreateNewAlter.create(),
						),
					new Button()
						.setLabel(this.translations.PAGINATION_PREVIOUS_PAGE)
						.setDisabled(pgObj?.memoryPage === 1)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPagination.PreviousPage.create(
								pgObj.id,
							),
						)
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setLabel(this.translations.PAGINATION_NEXT_PAGE)
						.setDisabled(
							pgObj?.memoryPage ===
								Math.ceil((pgObj?.documentCount ?? 0) / altersPerPage),
						)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPagination.NextPage.create(
								pgObj.id,
							),
						)
						.setStyle(ButtonStyle.Primary),

					new Button()
						.setStyle(ButtonStyle.Primary)
						.setEmoji(emojis.search)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPagination.Search.create(
								pgObj.id,
							),
						),
				),
			),
		];
	}

	async tagsSettings(system: PSystem, pgObj?: (typeof tagsPagination)[0]) {
		const tagsPerPage = 5;

		if (system.tagIds.length === 0) {
			return [
				...this.topView("tags", system.associatedUserId),
				...new AlertView(this.translations).errorView("ERROR_NO_TAGS"),
				new ActionRow().setComponents(
					new Button()
						.setLabel(this.translations.NEW_TAG_BTN)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.CreateNewTag.create(),
						)
						.setStyle(ButtonStyle.Primary),
				),
			];
		}

		const time = Date.now();
		const tagsCursor = tagCollection
			.find({
				systemId: system.associatedUserId,
				tagFriendlyName: { $regex: pgObj?.searchQuery ?? "" },
			})
			.sort({ tagFriendlyName: 1 })
			.limit(tagsPerPage)
			.skip(((pgObj?.memoryPage ?? 1) - 1) * tagsPerPage);

		const alters = await tagsCursor.toArray();
		const pgId = pgObj === undefined ? DiscordSnowflake.generate() : pgObj.id;

		if (pgObj === undefined) {
			const documentCount = await tagCollection.countDocuments({
				systemId: system.associatedUserId,
			});

			tagsPagination.push({
				id: String(pgId),
				memoryPage: 1,
				documentCount,
			});

			pgObj = {
				id: String(pgId),
				memoryPage: 1,
				documentCount,
			};
		}

		return [
			...this.topView("tags", system.associatedUserId),
			new Container().setComponents(
				new TextDisplay().setContent(
					`${this.translations.TAG_TITLE} - ${system.systemName}`,
				),
				new Separator().setSpacing(Spacing.Large),
				...alters.map((tag) => {
					return new Section()
						.setAccessory(
							new Button()
								.setLabel(this.translations.TAG_EDIT)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.ConfigureTag.create(
										tag.tagId,
									),
								)
								.setStyle(ButtonStyle.Primary)
								.setEmoji(emojis.wrenchWhite),
						)
						.setComponents(
							new TextDisplay().setContent(
								`${getEmojiFromTagColor(tag.tagColor)}  ${tag.tagFriendlyName}`,
							),
						);
				}),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					this.translations.TAGS_PAGINATION.replace(
						"{{ page }}",
						String(pgObj.memoryPage),
					)
						.replace(
							"{{ maxPage }}",
							String(Math.ceil((pgObj?.documentCount ?? 0) / tagsPerPage)),
						)
						.replace("{{ alters }}", String(alters.length))
						.replace("{{ maxAlters }}", String(pgObj.documentCount))
						.replace("{{ time }}", String(Date.now() - time))
						.replace(
							"{{ possibleSearchQuery }}",
							pgObj.searchQuery !== undefined
								? this.translations.ALTERS_POSSIBLE_SQ.replace(
										"{{ query }}",
										`\`${pgObj.searchQuery}\``,
									)
								: "",
						),
				),
				new ActionRow().setComponents(
					new Button()
						.setEmoji(emojis.plus)
						.setStyle(ButtonStyle.Primary)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.CreateNewTag.create(),
						),
					new Button()
						.setLabel(this.translations.PAGINATION_PREVIOUS_PAGE)
						.setDisabled(pgObj?.memoryPage === 1)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.PreviousPage.create(
								pgObj.id,
							),
						)
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setLabel(this.translations.PAGINATION_NEXT_PAGE)
						.setDisabled(
							pgObj?.memoryPage ===
								Math.ceil((pgObj?.documentCount ?? 0) / tagsPerPage),
						)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.NextPage.create(
								pgObj.id,
							),
						)
						.setStyle(ButtonStyle.Primary),

					new Button()
						.setStyle(ButtonStyle.Primary)
						.setEmoji(emojis.search)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.Search.create(
								pgObj.id,
							),
						),
				),
			),
		];
	}

	publicProfile(system: PSystem, prefix: string, isApplication: boolean) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(
					this.translations.S_PUBLIC_PROFILE_TITLE.replace(
						"{{ systemName }}",
						system.systemName,
					),
				),
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
								InteractionIdentifier.Systems.Configuration.SetPFP.create(),
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
								InteractionIdentifier.Systems.Configuration.SetBanner.create(),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.S_PUBLIC_PROFILE_PN_DESC.replace(
								"{{ systemName }}",
								system.systemName,
							).replace(
								"{{ pronouns }}",
								system.systemPronouns ??
									this.translations.PUBLIC_PROFILE_UNSET_PN,
							),
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_PRONOUNS)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.SetPronouns.create(),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.S_PUBLIC_PROFILE_DESC_DESC.replace(
								"{{ mention }}",
								mentionCommand(prefix, "system description", isApplication),
							),
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_DESCRIPTION)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.SetDescription.create(),
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.addComponents(
						new TextDisplay().setContent(
							this.translations.PUBLIC_PROFILE_SYSTEM_TAG_DESC
								.replace("{{ systemName }}", system.systemName)
								.replace("{{ displayTag }}", system.systemDisplayTag ?? this.translations.PUBLIC_PROFILE_UNSET_PN)
						),
					)
					.setAccessory(
						new Button()
							.setStyle(ButtonStyle.Secondary)
							.setLabel(this.translations.ALTER_SET_TAG)
							.setCustomId(
								InteractionIdentifier.Systems.Configuration.SetSystemTag.create(),
							),
					),
			),
		];
	}

	importSettings(system: PSystem) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(this.translations.IMPORT_SETTINGS_TITLE),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					
					this.translations.IMPORT_SETTINGS_DESC
				),
				new Separator().setSpacing(Spacing.Small).setDivider(false),
				new ActionRow().setComponents(
					new StringSelectMenu()
						.setCustomId(InteractionIdentifier.Systems.ImportMode.create())
						.setOptions([
							new StringSelectOption()
								.setDescription(
									this.translations.REPLACE_DESC
								)
								.setLabel(this.translations.REPLACE_NAME)
								.setValue("replace"),
							new StringSelectOption()
								.setDescription(
									this.translations.ADD_DESC
								)
								.setLabel(this.translations.ADD_NAME)
								.setValue("add"),
							new StringSelectOption()
								.setDescription(
									this.translations.FULL_IMPORT_DESC
								)
								.setLabel(this.translations.FULL_IMPORT_NAME)
								.setValue("full-mode"),
							new StringSelectOption()
								.setDescription(
									this.translations.DELETE_IMPORT_DESC
								)
								.setLabel(this.translations.DELETE_NAME)
								.setValue("delete"),
						]),
				),
			),
		];
	}
}
