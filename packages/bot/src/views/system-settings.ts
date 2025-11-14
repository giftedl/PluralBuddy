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
import { emojis } from "../lib/emojis";
import { friendlyProtection, listFromMask } from "../lib/privacy-bitmask";
import { alterCollection } from "@/mongodb";


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
							new TextDisplay()
								.setContent(
                                    // biome-ignore lint/style/useTemplate: a
									"By default, your system is completely private besides for server automatic moderation and if you use command publicly. \n(with `-public` at the end) Configuring this values tells PluralBuddy what to show to people that isn't yourself." +
										((system.public ?? 0) > 0
											? `\n-# ${this.translations.CREATING_NEW_SYSTEM_PRIVACY_SET} \`${friendlyProtection(this.translations, listFromMask(system.public ?? 0)).join("`, `")}\``
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

	async altersSettings(system: PSystem) {
		const alters = await alterCollection.find({ systemId: system.associatedUserId }).limit(10).toArray()

		return [
			new Container()
				.setComponents(
					new TextDisplay().setContent(`## Alters - ${system.systemName}`),
					new Separator().setSpacing(Spacing.Large),
					...(alters.map((alter) => {
						return new Section()
							.setAccessory(
								new Button()
									.setLabel("Edit Alter")
									.setCustomId(InteractionIdentifier.Systems.Configuration.ConfigureAlter.create(alter.alterId))
									.setStyle(ButtonStyle.Primary)
							)
							.setComponents(
								new TextDisplay()
									.setContent(`[@${alter.username}] **${alter.displayName}${alter.pronouns !== null ? ` | ${alter.pronouns}` : ""} ${alter.proxyTags[0] !== undefined ? `*(\`${alter.proxyTags[0].prefix}text${alter.proxyTags[0].suffix}\`)*` : ""}`)
							)
					}))
				)
		]
	}
}
