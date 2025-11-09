/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";


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
                    [
                        new Label()
                            .setLabel(ctx.userTranslations().PLURALBUDDY_IMPORT_SOURCE)
                            .setDescription(ctx.userTranslations().PLURALBUDDY_IMPORT_DESC)
                            .setComponent(
                                new TextInput()
                                    .setCustomId(InteractionIdentifier.Setup.FormSelection.ImportType.create())
                                    .setStyle(TextInputStyle.Paragraph)
                            )
                    ]
                )
        )
    }
}