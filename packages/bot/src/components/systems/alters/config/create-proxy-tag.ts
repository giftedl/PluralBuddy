/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../../lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";


export default class CreateProxyTag extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(context: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.Alters.CreateProxyTag.startsWith(context.customId);
    }

    override async run(context: ComponentContext<typeof this.componentType>) {
        const alterId = InteractionIdentifier.Systems.Configuration.Alters.CreateProxyTag.substring(context.customId)[0];

        return await context.modal(
            new Modal()
                .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.ProxyForm.create(alterId?.toString() ?? ""))
                .setTitle(context.userTranslations().CREATING_NEW_PT_FORM_TITLE)
                .addComponents(
                    new Label()
                        .setLabel(context.userTranslations().CREATING_NEW_PT_FORM_LABEL)
                        .setDescription(context.userTranslations().CREATING_NEW_PT_FORM_DESC)
                        .setComponent(
                            new TextInput()
                                .setStyle(TextInputStyle.Short)
                                .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.ProxyType.create())
                                .setRequired(true)
                                .setLength({ min: 4, max: 44})
                        )
                )
        )
    }
}