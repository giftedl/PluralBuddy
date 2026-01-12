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
				new TextDisplay().setContent("## Nudge Preferences"),
				new Separator().setSpacing(Spacing.Large),
				new Section()
					.setAccessory(
						new Button()
							.setLabel(
								user.nudging.currentlyEnabled
									? "Disable Nudging"
									: "Enable Nudging",
							)
							.setCustomId(InteractionIdentifier.Nudge.ToggleNudge.create())
							.setStyle(ButtonStyle.Primary),
					)
					.setComponents(
						new TextDisplay().setContent(
							"Nudging allows other users to ping or nudge you based on your alter. You can toggle this setting at any time. Disabling this setting does not take away your ability to nudge others, it only disables the ability for others to nudge you.",
						),
					),
				new Separator().setSpacing(Spacing.Large),
				new TextDisplay().setContent(
					`You can block users from nudging you specifically. Currently, you have ${user.nudging.blockedUsers.length} user(s) blocked.`,
				),
				new ActionRow().setComponents(
					new Button()
						.setLabel(`${user.nudging.blockedUsers.length >= 100 ? "Export" : "View"} Nudge Blocklist`)
						.setCustomId(InteractionIdentifier.Nudge.ExportBlockList.create())
						.setStyle(ButtonStyle.Primary),
					new Button()
						.setLabel("Remove User")
						.setCustomId(InteractionIdentifier.Nudge.RemoveBlock.create())
						.setStyle(ButtonStyle.Danger),
					new Button()
						.setLabel("Add User")
						.setCustomId(InteractionIdentifier.Nudge.AddBlock.create())
						.setStyle(ButtonStyle.Secondary),
				),
			),
		];
	}
}
