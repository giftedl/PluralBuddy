/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, FileUpload, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";

export default class SetupImportPluralBuddy extends ComponentCommand {
    componentType = 'StringSelect' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Setup.ImportSelection.PluralBuddy.equals(ctx.interaction.values[0] as string);
      }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        ctx.modal(
            new Modal()
                .setTitle(ctx.userTranslations().IMPORT_PLURALBUDDY_DESCRIPTION)
                .setCustomId(InteractionIdentifier.Setup.FormSelection.ImportForm.create())
                .setComponents(
                    [new Label()
                        .setLabel(ctx.userTranslations().IMPORT_SOURCE_DESCRIPTION)
                        .setComponent(
                            new FileUpload()
                                .setCustomId(InteractionIdentifier.Setup.FormSelection.ImportType.create())
                                .setMaxValues(1)
                                .setMinValues(1)
                                .setRequired(true)
                        )]
                )
        )
    }
}