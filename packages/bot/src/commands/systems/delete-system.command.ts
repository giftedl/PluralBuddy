/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	ActionRow,
	Button,
	Options,
	type CommandContext,
	createBooleanOption,
	Declare,
	SubCommand,
	Container,
	TextDisplay,
} from "seyfert";
import { AlertView } from "../../views/alert";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "../../lib/interaction-ids";
import { emojis } from "../../lib/emojis";

const options = {
	"media-included": createBooleanOption({
		description:
			"Deleting the media will ensure the media gets deleted in around 7-8 days from now.",
		aliases: ["m", "mi"],
	}),
};

@Declare({
	name: "delete",
	description: "Removes the system",
	contexts: ["BotDM", "Guild"],
})
@Options(options)
export default class SetupCommand extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		const { "media-included": mi } = ctx.options;

		return await ctx.ephemeral({
			components: [
				new Container().setComponents(
					new TextDisplay()
						.setContent(ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION)
				).setColor("#FF1717"),

				new ActionRow().setComponents(
					new Button()
						.setEmoji(emojis.circleQuestionWhite)
						.setStyle(ButtonStyle.Danger)
						.setLabel(ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION_BTN)
						.setCustomId(
							(mi
								? InteractionIdentifier.Systems.DeleteSystemMedia
								: InteractionIdentifier.Systems.DeleteSystem
							).create(),
						),
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
