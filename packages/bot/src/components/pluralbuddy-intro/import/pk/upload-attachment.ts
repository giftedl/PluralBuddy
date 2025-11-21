/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, FileUpload, Label, Modal, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";

export default class PluralKitUploadAttachment extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Setup.PluralKitImport.UploadAttachment.startsWith(
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
                            new FileUpload()
                                .setCustomId(InteractionIdentifier.Setup.FormSelection.PkType.create())
                                .setMaxValues(1)
                                .setMinValues(1)
                                .setRequired(true)
                        )]
                ),
		);
	}
}
