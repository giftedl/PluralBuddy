/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { InteractionIdentifier } from "@/lib/interaction-ids";
import {
	Declare,
	Label,
	MenuCommandContext,
	MessageCommandInteraction,
	Modal,
	TextInput,
} from "seyfert";
import { ContextMenuCommand } from "seyfert";
import { ApplicationCommandType, TextInputStyle } from "seyfert/lib/types";

@Declare({
	type: ApplicationCommandType.Message,
	name: `${process.env.BRANCH === "canary" ? "Canary " : ""}Edit Message`,
	contexts: ["BotDM", "Guild"],
})
export default class EditMessageContextMenuCommand extends ContextMenuCommand {
	override async run(ctx: MenuCommandContext<MessageCommandInteraction>) {
		const modal = new Modal()
			.setCustomId(
				InteractionIdentifier.EditMenu.EditContextForm.create(ctx.target.id),
			)
			.setTitle(ctx.userTranslations().EDIT_MESSAGE)
			.setComponents([
				new Label()
					.setLabel(ctx.userTranslations().MESSAGE_CONTENTS)
					.setComponent(
						new TextInput()
							.setCustomId(
								InteractionIdentifier.EditMenu.EditContextType.create(),
							)
							.setStyle(TextInputStyle.Paragraph)
							.setRequired(true),
					),
			]);

        return await ctx.modal(modal);
	}
}
