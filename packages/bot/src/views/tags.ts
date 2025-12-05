/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { tagColors, tagHexColors, type PTag } from "@/types/tag";
import { TranslatedView } from "./translated-view";
import {
	ActionRow,
	Button,
	Container,
	Section,
	Separator,
	TextDisplay,
} from "seyfert";
import { emojis, getEmojiFromTagColor } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import {
	friendlyProtectionTags,
	listFromMaskTags,
} from "../lib/privacy-bitmask";
import { mentionCommand } from "@/lib/mention-command";

export class TagView extends TranslatedView {
	tagProfileView(tag: PTag, external = false) {
		const innerComponents =
			new TextDisplay().setContent(`## ${getEmojiFromTagColor(tag.tagColor)} ${tag.tagFriendlyName}
${tag.tagDescription !== null ? "\n" : ""}${tag.tagDescription ?? ""}${tag.tagDescription !== null ? "\n" : ""}
**Alter Count:** ${tag.associatedAlters.length}\n
-# ID: \`${tag.tagId}\``);

		return [
			new Container()
				.setComponents(innerComponents)
				.setColor(`#${tagHexColors[tagColors.indexOf(tag.tagColor)]}`),
		];
	}

	tagConfigureButton(tag: PTag) {
		return [
			new ActionRow().setComponents(
				new Button()
					.setLabel("Configure Profile")
					.setEmoji(emojis.wrenchWhite)
					.setCustomId(
						InteractionIdentifier.Systems.Configuration.Tags.ConfigureTagExternal.create(
							tag.tagId,
						),
					)
					.setStyle(ButtonStyle.Primary),
			),
		];
	}

	tagTopView(currentTab: "general", tagId: string, tagUsername: string) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(`-# ${tagUsername} • ID: \`${tagId}\``),

				new ActionRow().setComponents(
					new Button()
						.setLabel("Back")
						.setStyle(ButtonStyle.Secondary)
						.setEmoji(emojis.undo)
						.setCustomId(
							InteractionIdentifier.Systems.Configuration.Tags.Index.create(),
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
							InteractionIdentifier.Systems.Configuration.Tags.GeneralSettings.create(
								tagId,
							),
						),
				),
			),
		];
	}

	tagGeneral(tag: PTag, prefix: string, applicationCommand: boolean) {
		return [
			new Container()
				.setComponents(
					new TextDisplay().setContent(
						this.translations.TAG_GENERAL.replace(
							"%general%",
							getEmojiFromTagColor(tag.tagColor),
						).replace("%tag%", tag.tagFriendlyName),
					),
					new Separator().setSpacing(Spacing.Large),
					new Section()
						.addComponents(
							new TextDisplay().setContent(
								this.translations.TAG_SET_DISPLAY_NAME_DESC,
							),
						)
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.ALTER_SET_DISPLAY)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Tags.SetDisplayName.create(
										tag.tagId,
									),
								),
						),
					new Separator().setSpacing(Spacing.Small),
					new Section()
						.addComponents(
							new TextDisplay().setContent(
								this.translations.TAG_SET_COLOR_DESC,
							),
						)
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.TAG_SET_COLOR)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Tags.SetColor.create(
										tag.tagId,
									),
								),
						),
					new Separator().setSpacing(Spacing.Small),
					new Section()
						.addComponents(
							new TextDisplay().setContent(
								`${this.translations.TAG_SET_PRIVACY_DESC}
${
	(tag.public ?? 0) > 0
		? `\n-# ${this.translations.CREATING_NEW_SYSTEM_PRIVACY_SET} \`${friendlyProtectionTags(this.translations, listFromMaskTags(tag.public ?? 0)).join("`, `")}\``
		: ""
}`,
							),
						)
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.TAG_SET_PRIVACY)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Tags.SetPrivacy.create(
										tag.tagId,
									),
								),
						),
					new Separator().setSpacing(Spacing.Small),
					new Section()
						.addComponents(
							new TextDisplay().setContent(
								`You can set a description for your alter. Alter descriptions can be at maximum 2,000 characters long.
-# To view your description in full, run: ${mentionCommand(prefix, "edit-tag description", applicationCommand, tag.tagFriendlyName)}`,
							),
						)
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.ALTER_SET_DESCRIPTION)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Tags.SetDescription.create(
										tag.tagId,
									),
								),
						),
					new Separator().setSpacing(Spacing.Small),
					new Section()
						.addComponents(
							new TextDisplay().setContent(
								`You can assign an unlimited amount of tags to an alter and an unlimited amount of alters to a tag.`,
							),
						)
						.setAccessory(
							new Button()
								.setStyle(ButtonStyle.Secondary)
								.setLabel(this.translations.TAG_ASSIGN_ALTER)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.Tags.AssignAlter.create(
										tag.tagId,
									),
								),
						),
				)
				.setColor(`#${tagHexColors[tagColors.indexOf(tag.tagColor)]}`),
		];
	}
}
