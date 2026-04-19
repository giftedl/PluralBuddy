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
	type APIContainerComponent,
	type APITextDisplayComponent,
} from "seyfert/lib/types";

@Declare({
	type: ApplicationCommandType.Message,
	name: `${process.env.BRANCH === "canary" ? "Canary " : ""}Edit Message`,
	contexts: ["BotDM", "Guild"],
})
export default class EditMessageContextMenuCommand extends ContextMenuCommand {
	override async run(ctx: MenuCommandContext<MessageCommandInteraction>) {
		const isExpress = ctx.target.webhookId === undefined;
		const contents = ctx.target.components.find((v) =>
			isExpress
				? (v.data.type === ComponentType.TextDisplay &&
						!v.data.content.startsWith(`-# ${emojis.reply}`)) ||
					v.data.type === ComponentType.Container
				: v.data.type === ComponentType.TextDisplay &&
					!v.data.content.startsWith(`-# ${emojis.reply}`),
		);
		const innerComp = (contents ?? { data: { content: "" } }).data as
			| APITextDisplayComponent
			| APIContainerComponent;

		const modal = new Modal()
			.setCustomId(
				InteractionIdentifier.EditMenu.EditContextForm.create(ctx.target.id),
			)
			.setTitle((await ctx.userTranslations()).EDIT_MESSAGE)
			.setComponents([
				new Label()
					.setLabel((await ctx.userTranslations()).MESSAGE_CONTENTS)
					.setComponent(
						new TextInput()
							.setCustomId(
								InteractionIdentifier.EditMenu.EditContextType.create(),
							)
							.setValue(
								"content" in innerComp
									? innerComp.content
									: innerComp.components[0]?.type === ComponentType.TextDisplay
										? innerComp.components[0]?.content
										: "",
							)
							.setStyle(TextInputStyle.Paragraph)
							.setRequired(true),
					),
			]);

		return await ctx.modal(modal);
	}
}
