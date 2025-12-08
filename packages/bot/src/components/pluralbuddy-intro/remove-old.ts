/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	ComponentCommand,
	TextDisplay,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "../../lib/interaction-ids";
import { AlertView } from "../../views/alert";
import { ButtonStyle } from "seyfert/lib/types";
import { emojis } from "../../lib/emojis";
import { Container } from "seyfert";

export default class RemoveOldSystem extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.RemoveOldSystem.equals(ctx.customId);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		return await ctx.update({
			components: [
				new Container()
					.setComponents(
						new TextDisplay().setContent(
							ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION,
						),
					)
					.setColor("#FF1717"),

				new Container().setSpoiler(true).setComponents(
					new ActionRow().setComponents(
						new Button()
							.setEmoji(emojis.circleQuestionWhite)
							.setStyle(ButtonStyle.Danger)
							.setLabel(ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION_BTN)
							.setCustomId(InteractionIdentifier.Systems.DeleteSystem.create()),
					),
				),
			],
		});
	}
}
