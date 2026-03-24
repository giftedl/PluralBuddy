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
import { mentionCommand } from "@/lib/mention-command";

export default class RemoveOldSystem extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.RemoveOldSystem.equals(ctx.customId);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		// I only put the loading component in or else the spoiler wont appear in the next message on the client.
		await ctx.update({
			components: [
				new Container().setComponents(
					new TextDisplay().setContent(emojis.loading),
				),
			],
		});
		return await ctx.editResponse({
			components: [
				new Container()
					.setComponents(
						new TextDisplay().setContent(
							ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION,
						),
					)
					.setColor("#FF1717"),
				new Container()
					.setSpoiler(true)
					.setComponents(
						new ActionRow().setComponents(
							new Button()
								.setEmoji(emojis.settingsWhite)
								.setStyle(ButtonStyle.Primary)
								.setLabel(ctx.userTranslations().BACK_TO_SAFETY_BTN)
								.setCustomId(
									InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create(),
								),
							new Button()
								.setEmoji(emojis.circleQuestionWhite)
								.setStyle(ButtonStyle.Danger)
								.setLabel(
									ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION_BTN,
								)
								.setCustomId(
									InteractionIdentifier.Systems.DeleteSystem.create(),
								),
						),
						new TextDisplay().setContent(
							ctx
								.userTranslations()
								.CONFIRMATION_SYSTEM_DELETION_PRIVACY.replace(
									"%command%",
									mentionCommand(
										(await ctx.getDefaultPrefix()) ?? "pb;",
										"system delete",
										ctx.interaction.message.messageReference === undefined,
										"-mi",
									),
								),
						),
					),
			],
		});
	}
}
