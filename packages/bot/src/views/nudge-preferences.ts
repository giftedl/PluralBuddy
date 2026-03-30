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
import type { PUser } from "plurography";
import { InteractionIdentifier } from "@/lib/interaction-ids";

export class NudgePreferences extends TranslatedView {
	nudgePreferences(user: PUser) {
		return [
			new Container().setComponents(
				new TextDisplay().setContent(this.translations.NUDGE_PREF_TITLE),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.setAccessory(
						new Button()
							.setLabel(
								(user.nudging ?? { currentlyEnabled: true }).currentlyEnabled
									? this.translations.DISABLE_NUDGING
									: this.translations.ENABLE_NUDGING,
							)
							.setCustomId(InteractionIdentifier.Nudge.ToggleNudge.create())
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(this.translations.NUDGING_DESC),
					),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.setComponents(
						new TextDisplay().setContent(this.translations.DM_REPLIES_DESC),
					)
					.setAccessory(
						new Button()
							.setCustomId(
								InteractionIdentifier.Nudge.ToggleDMReplies.create("false"),
							)
							.setStyle(ButtonStyle.Primary)
							.setLabel(
								user.nudging.dmReply
									? this.translations.DISABLE_DM
									: this.translations.ENABLE_DM,
							),
					),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					this.translations.BLOCK_USERS_DESC.replace(
						"{{ userCount }}",
						String(
							((user.nudging ?? { blockedUsers: [] }).blockedUsers ?? [])
								.length,
						),
					),
				),
				new ActionRow().setComponents(
					new Button()
						.setLabel(
							((user.nudging ?? { blockedUsers: [] }).blockedUsers ?? []).length >= 100 ? this.translations.EXPORT_NUDGE_BLOCKLIST : this.translations.VIEW_NUDGE_BLOCKLIST,
						)
						.setCustomId(InteractionIdentifier.Nudge.ExportBlockList.create())
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setLabel(this.translations.REMOVE_NUDGE_BLOCKED_USER)
						.setCustomId(InteractionIdentifier.Nudge.RemoveBlock.create())
						.setStyle(ButtonStyle.Danger),
					new Button()
						.setLabel(this.translations.ADD_NUDGE_BLOCKED_USER)
						.setCustomId(InteractionIdentifier.Nudge.AddBlock.create())
						.setStyle(ButtonStyle.Secondary),
				),
			),
		];
	}
}
