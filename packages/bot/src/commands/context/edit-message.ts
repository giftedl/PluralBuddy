/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { messagesCollection } from "@/mongodb";
import {
	Declare,
	Label,
	MenuCommandContext,
	MessageCommandInteraction,
	Modal,
	TextInput,
} from "seyfert";
import { ContextMenuCommand } from "seyfert";
import {
	ApplicationCommandType,
	ComponentType,
	TextInputStyle,
	type APITextDisplayComponent,
} from "seyfert/lib/types";

@Declare({
	type: ApplicationCommandType.Message,
	name: `${process.env.BRANCH === "canary" ? "Canary " : ""}Edit Message`,
	contexts: ["BotDM", "Guild"],
})
export default class EditMessageContextMenuCommand extends ContextMenuCommand {
	override async run(ctx: MenuCommandContext<MessageCommandInteraction>) {
		const contents = ctx.target.components.find(
			(v) =>
				v.data.type === ComponentType.TextDisplay &&
				!v.data.content.startsWith(`-# ${emojis.reply}`),
		);

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
							.setValue((contents?.data as APITextDisplayComponent).content)
							.setStyle(TextInputStyle.Paragraph)
							.setRequired(true),
					),
			]);

		return await ctx.modal(modal);
	}
}
