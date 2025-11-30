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
import { ButtonStyle, Spacing } from "seyfert/lib/types";
import type { PGuild } from "../types/guild";
import type { TranslationString } from "../lang";
import { InteractionIdentifier } from "../lib/interaction-ids";
import { createdSystems } from "../components/pluralbuddy-intro/create-new-system";
import { friendlyProtectionSystem, listFromMaskSystems } from "../lib/privacy-bitmask";
import { TranslatedView } from "./translated-view";
import { emojis } from "@/lib/emojis";

export class PluralBuddyIntro extends TranslatedView {
	pageOne() {
		const paginationContainer = new Container();
		paginationContainer.setComponents([
			new TextDisplay().setContent(
				`-# ${this.translations.PAGINATION_TITLE} 1/3`,
			),
			new ActionRow().setComponents([
				new Button()
					.setLabel(this.translations.PAGINATION_PREVIOUS_PAGE)
					.setDisabled(true)
					.setStyle(ButtonStyle.Secondary)
					.setCustomId("b"),
				new Button()
					.setLabel(this.translations.PAGINATION_NEXT_PAGE)
					.setCustomId(InteractionIdentifier.Setup.Pagination.Page2.create())
					.setStyle(ButtonStyle.Primary),
			]),
		]);

		return [
			new Container().setComponents([
				new TextDisplay().setContent(this.translations.INTRODUCTION_MESSAGE),
			]),
			paginationContainer,
		];
	}
	pageTwo() {
		const textContainer = new Container();
		textContainer.setComponents(
			new TextDisplay().setContent(this.translations.IMPORT_MESSAGE),
		);

		const paginationContainer = new Container();
		paginationContainer.setComponents([
			new TextDisplay().setContent(
				`-# ${this.translations.PAGINATION_TITLE} 2/3`,
			),
			new ActionRow().setComponents([
				new Button()
					.setLabel(this.translations.PAGINATION_PREVIOUS_PAGE)
					.setStyle(ButtonStyle.Secondary)
					.setCustomId(InteractionIdentifier.Setup.Pagination.Page1.create()),
				new Button()
					.setLabel(this.translations.CREATE_NEW_SYS_DESCRIPTION)
					.setStyle(ButtonStyle.Primary)
					.setCustomId(
						InteractionIdentifier.Setup.CreateNewSystem.Index.create(),
					),
			]),
			new Separator(),
			new ActionRow().setComponents(
				new StringSelectMenu()
					.setCustomId(
						InteractionIdentifier.Setup.ImportSelection.Index.create(),
					)
					.setPlaceholder(this.translations.IMPORT_SOURCE_DESCRIPTION)
					.setOptions([
						new StringSelectOption()
							.setLabel("PluralKit")
							.setDescription(this.translations.IMPORT_PLURALKIT_DESCRIPTION)
							.setValue(
								InteractionIdentifier.Setup.ImportSelection.PluralKit.create(),
							),
						new StringSelectOption()
							.setLabel("Tupperbox")
							.setDescription(this.translations.IMPORT_TUPPERBOX_DESCRIPTION)
							.setValue(
								InteractionIdentifier.Setup.ImportSelection.Tupperbox.create(),
							),
						new StringSelectOption()
							.setLabel("PluralBuddy")
							.setDescription(this.translations.IMPORT_PLURALBUDDY_DESCRIPTION)
							.setValue(
								InteractionIdentifier.Setup.ImportSelection.PluralBuddy.create(),
							),
					]),
			),
		]);

		return [textContainer, paginationContainer];
	}
	createNewSystemPage(
		guild: PGuild,
		rootInteractionId: string,
		userId: string,
	) {
		let temporarySystem = createdSystems.get(rootInteractionId);

		if (temporarySystem === undefined) {
			temporarySystem = {
				associatedUserId: userId,

				alterIds: [],
				tagIds: [],
				createdAt: new Date(),

				systemAutoproxy: [],
				public: 0,
			};
		}

		const filledState = guild.usersRequiredSystemTag
			? temporarySystem.systemDisplayTag !== undefined &&
				temporarySystem.systemName !== undefined
			: temporarySystem.systemName !== undefined;

		const textContainer = new Container();
		const paginationContainer = new Container();
		const systemTagElements = [
			new Separator().setSpacing(Spacing.Large),
			new Section()
				.setComponents(
					new TextDisplay().setContent(
						this.translations.CREATING_NEW_SYSTEM_TAG_MESSAGE +
							(temporarySystem.systemDisplayTag !== undefined
								? `\n-# ${this.translations.CREATING_NEW_SYSTEM_TAG_SET} \`${temporarySystem.systemDisplayTag}\``
								: ""),
					),
				)
				.setAccessory(
					new Button()
						.setStyle(
							temporarySystem.systemDisplayTag !== undefined
								? ButtonStyle.Secondary
								: ButtonStyle.Primary,
						)
						.setLabel(this.translations.CREATING_NEW_SYSTEM_TAG_BUTTON)
						.setCustomId(
							InteractionIdentifier.Setup.CreateNewSystem.SystemTag.create(
								rootInteractionId,
							),
						),
				),
		];

		paginationContainer.setComponents([
			new TextDisplay().setContent(
				filledState
					? this.translations.PAGE_NEW_SYS_TEXT_FILLED
					: this.translations.PAGE_NEW_SYS_TEXT,
			),
			new ActionRow().setComponents([
				new Button()
					.setLabel(this.translations.PAGINATION_PREVIOUS_PAGE)
					.setStyle(ButtonStyle.Secondary)
					.setCustomId(InteractionIdentifier.Setup.Pagination.Page2.create()),
				new Button()
					.setLabel(this.translations.PAGINATION_FINISH)
					.setCustomId(
						InteractionIdentifier.Setup.Pagination.Page3.create(
							rootInteractionId,
						),
					)
					.setStyle(filledState ? ButtonStyle.Primary : ButtonStyle.Danger)
					.setDisabled(!filledState),
			]),
		]);

		textContainer.setComponents(
			new TextDisplay().setContent(
				this.translations.CREATING_NEW_SYSTEM_HEADER,
			),
			new Section()
				.addComponents(
					new TextDisplay().setContent(
						this.translations.CREATING_NEW_SYSTEM_NAME_MESSAGE +
							(temporarySystem.systemName !== undefined
								? `\n-# ${this.translations.CREATING_NEW_SYSTEM_NAME_SET} \`${temporarySystem.systemName}\``
								: ""),
					),
				)
				.setAccessory(
					new Button()
						.setStyle(
							temporarySystem.systemName !== undefined
								? ButtonStyle.Secondary
								: ButtonStyle.Primary,
						)
						.setLabel(this.translations.CREATING_NEW_SYSTEM_NAME_BUTTON)
						.setCustomId(
							InteractionIdentifier.Setup.CreateNewSystem.Name.create(
								rootInteractionId,
							),
						),
				),
			...(guild.usersRequiredSystemTag ? systemTagElements : []),
			new Separator().setSpacing(Spacing.Large),
			new Section()
				.addComponents(
					new TextDisplay().setContent(
						this.translations.CREATING_NEW_SYSTEM_PRIVACY_MESSAGE +
							((temporarySystem.public ?? 0) > 0
								? `\n-# ${this.translations.CREATING_NEW_SYSTEM_PRIVACY_SET} \`${friendlyProtectionSystem(this.translations, listFromMaskSystems(temporarySystem.public ?? 0)).join("`, `")}\``
								: ""),
					),
				)
				.setAccessory(
					new Button()
						.setStyle(ButtonStyle.Primary)
						.setLabel(this.translations.CREATING_NEW_SYSTEM_PRIVACY_BUTTON)
						.setCustomId(
							InteractionIdentifier.Setup.CreateNewSystem.Privacy.create(
								rootInteractionId,
							),
						)
						.setStyle(
							(temporarySystem.public ?? 0) > 0
								? ButtonStyle.Secondary
								: ButtonStyle.Primary,
						),
				),
		);

		createdSystems.set(rootInteractionId, temporarySystem);
		return [textContainer, paginationContainer];
	}

	pluralKitImportPage(rootInteractionId: string) {
		const textContainer = new Container();
		const paginationContainer = new Container();

        textContainer.setComponents(
            new TextDisplay().setContent(this.translations.PK_IMPORT_START),
            new Separator().setSpacing(Spacing.Large),
            new TextDisplay().setContent(`### Step 1: Export PluralKit system contents
You must export your system JSON file from PluralKit to import into PluralBuddy. To do this, either send \`pk;export\` in a server with PluralKit apart of it or just direct message <@466378653216014359> and send \`pk;export\` as a message.`),        
            new Separator(),
            new Section()
            .setComponents(
                new TextDisplay().setContent(`### Step 2: Import system contents
Please download the JSON file sent to you and use the button to upload the attachment to PluralBuddy.`)
            )
            .setAccessory(
                new Button()
                    .setCustomId(InteractionIdentifier.Setup.PluralKitImport.UploadAttachment.create())
                    .setEmoji(emojis.plus)
                    .setLabel("Upload Contents")
                    .setStyle(ButtonStyle.Primary)
            )
        )

		paginationContainer.setComponents([
			new TextDisplay().setContent(
				`-# ${this.translations.PAGINATION_TITLE} 3/3`,
			),
			new ActionRow().setComponents([
				new Button()
					.setLabel(this.translations.PAGINATION_PREVIOUS_PAGE)
					.setStyle(ButtonStyle.Secondary)
					.setCustomId(InteractionIdentifier.Setup.Pagination.Page2.create())
			]),
		]);

		return [textContainer, paginationContainer];
	}
}
