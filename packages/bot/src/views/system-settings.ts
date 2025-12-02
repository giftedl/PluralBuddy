/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	Container,
	Section,
	Separator,
	TextDisplay,
} from "seyfert";
import { TranslatedView } from "./translated-view";
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import { InteractionIdentifier } from "../lib/interaction-ids";
import type { PSystem } from "../types/system";
import { emojis, getEmojiFromTagColor } from "../lib/emojis";
import { friendlyProtectionSystem, listFromMaskSystems } from "../lib/privacy-bitmask";
import { alterCollection, tagCollection } from "@/mongodb";
import type { FindCursor, WithId } from "mongodb";
import type { PAlter } from "@/types/alter";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { AlertView } from "./alert";

export const alterPagination: {
	id: string;
	memoryPage: number;
	documentCount: number;
}[] = [];

export const tagsPagination: {
	id: string;
	memoryPage: number;
	documentCount: number;
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
							InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create(),
						),
					new Button()
						.setLabel("Alters")
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
						.setLabel("Tags")
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
							InteractionIdentifier.Systems.Configuration.PublicProfile.Index.create(),
						),
				),
			),
		];
	}

	generalSettings(system: PSystem) {
		return [
			new Container()
				.setComponents(
					new TextDisplay().setContent(
						`## ${emojis.settings} General Settings - ${system.systemName}`,
					),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel("Set System Name")
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.SetName.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(
								"The title of your system is the first thing that identifies your system and is the appears on the overlying structure to all of your system members. They must be at least 3 characters long and shorter than 20 characters long.",
							),
						),
					new Separator(),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel("Set Nickname Format")
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.SetNicknameFormat.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(
								"The nickname format value is how your nickname is laid out when an alter uses the *Nickname* proxy mode. By default, its just the alters username, however you can customize that.",
							),
						),
					new Separator(),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel("Set System Privacy")
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.SetPrivacy.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(
								// biome-ignore lint/style/useTemplate: a
								"By default, your system is completely private besides for server automatic moderation and if you use command publicly. \n(with `-public` at the end) Configuring this values tells PluralBuddy what to show to people that isn't yourself." +
									((system.public ?? 0) > 0
										? `\n-# ${this.translations.CREATING_NEW_SYSTEM_PRIVACY_SET} \`${friendlyProtectionSystem(this.translations, listFromMaskSystems(system.public ?? 0)).join("`, `")}\``
										: ""),
							),
						),
					new Separator(),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel("Export System")
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.ExportSystem.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(
								"Exporting the system will simply export all data from the system and send it to your DM's. Ensure your DM's are open to PluralBuddy before exporting.",
							),
						),
					new Separator(),
					new Section()
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Danger)
								.setLabel("Delete System")
								.setCustomId(
									InteractionIdentifier.Setup.RemoveOldSystem.create(),
								),
						)
						.setComponents(
							new TextDisplay().setContent(
								"**This cannot be undone**. Deleting your system will delete your system along with all other alters, tags, and other system assets.",
							),
						),
				)
				.setColor("#1190FF"),
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
						.setLabel("Create new alter")
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPagination.CreateNewAlter.create(),
						)
						.setStyle(ButtonStyle.Primary),
				),
			];
		}

		const time = Date.now();
		const altersCursor = alterCollection
			.find({ systemId: system.associatedUserId })
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

			// biome-ignore lint/style/noParameterAssign: not really any other way to do it.
			pgObj = {
				id: String(pgId),
				memoryPage: 1,
				documentCount,
			};
		}

		return [
			...this.topView("alters", system.associatedUserId),
			new Container().setComponents(
				new TextDisplay().setContent(`## Alters - ${system.systemName}`),
				new Separator().setSpacing(Spacing.Large),
				...alters.map((alter) => {
					return new Section()
						.setAccessory(
							new Button()
								.setLabel("Edit Alter")
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
					`-# Page ${pgObj.memoryPage}/${Math.ceil((pgObj?.documentCount ?? 0) / altersPerPage)} · Found ${alters.length}/${pgObj.documentCount} alter(s) in ${Date.now() - time}ms`,
				),
				new ActionRow().setComponents(
					new Button()
						.setEmoji(emojis.plus)
						.setStyle(ButtonStyle.Primary)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPagination.CreateNewAlter.create(pgObj.id),
						),
					new Button()
						.setLabel("Previous Page")
						.setDisabled(pgObj?.memoryPage === 1)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.AlterPagination.PreviousPage.create(
								pgObj.id,
							),
						)
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setLabel("Next Page")
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
				),
			),
		];
	}


	async tagsSettings(system: PSystem, pgObj?: (typeof tagsPagination)[0]) {
		const tagsPerPage = 5;

		if (system.alterIds.length === 0) {
			return [
				...this.topView("tags", system.associatedUserId),
				...new AlertView(this.translations).errorView("ERROR_NO_TAGS"),
				new ActionRow().setComponents(
					new Button()
						.setLabel("Create new tag")
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.CreateNewTag.create(),
						)
						.setStyle(ButtonStyle.Primary),
				),
			];
		}

		const time = Date.now();
		const tagsCursor = tagCollection
			.find({ systemId: system.associatedUserId })
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

			// biome-ignore lint/style/noParameterAssign: not really any other way to do it.
			pgObj = {
				id: String(pgId),
				memoryPage: 1,
				documentCount,
			};
		}

		return [
			...this.topView("tags", system.associatedUserId),
			new Container().setComponents(
				new TextDisplay().setContent(`## Tags - ${system.systemName}`),
				new Separator().setSpacing(Spacing.Large),
				...alters.map((tag) => {
					return new Section()
						.setAccessory(
							new Button()
								.setLabel("Edit Tag")
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
					`-# Page ${pgObj.memoryPage}/${Math.ceil((pgObj?.documentCount ?? 0) / tagsPerPage)} · Found ${alters.length}/${pgObj.documentCount} tag(s) in ${Date.now() - time}ms`,
				),
				new ActionRow().setComponents(
					new Button()
						.setEmoji(emojis.plus)
						.setStyle(ButtonStyle.Primary)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.CreateNewTag.create(pgObj.id),
						),
					new Button()
						.setLabel("Previous Page")
						.setDisabled(pgObj?.memoryPage === 1)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.TagPagination.PreviousPage.create(
								pgObj.id,
							),
						)
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setLabel("Next Page")
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
				),
			),
		];
	}

	publicProfile() {}
}
