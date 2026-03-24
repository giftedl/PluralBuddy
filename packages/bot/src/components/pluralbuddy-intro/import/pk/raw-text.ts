/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, FileUpload, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";

export default class PluralKitRawText extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.PluralKitImport.RawText.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		return await ctx.modal(
			new Modal()
				.setTitle(ctx.userTranslations().IMPORT_PLURALKIT_DESCRIPTION)
				.setCustomId(InteractionIdentifier.Setup.FormSelection.PkForm.create())
                .setComponents(
                    [new Label()
                        .setLabel(ctx.userTranslations().IMPORT_SOURCE_DESCRIPTION)
                        .setComponent(
                            new TextInput()
                                .setCustomId(InteractionIdentifier.Setup.FormSelection.PkRawTextType.create())
                                .setStyle(TextInputStyle.Paragraph)
                                .setRequired(true)
                        )]
                ),
		);
	}
}
