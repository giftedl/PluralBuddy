/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { AlertView } from "../../../views/alert";

export default class SetName extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.GeneralTab.SetName.equals(ctx.customId)  
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const oldSystemName = (await ctx.retrievePUser()).system?.systemName

        if (oldSystemName === undefined) {
            return await ctx.interaction.update({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
          }
        
        const form = new Modal()
            .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.NameForm.create())
            .setTitle(ctx.userTranslations().EDIT_SYSTEM_FORM_TITLE)
            .addComponents(
                [
                    new Label()
                        .setLabel(ctx.userTranslations().SYSTEM_NAME_FORM_LABEL)
                        .setComponent(
                            oldSystemName.length > 3 ? 
                                new TextInput()
                                    .setStyle(TextInputStyle.Short)
                                    .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.NameType.create())
                                    .setLength({ min: 3, max: 20 })
                                    .setRequired(true)
                                    .setValue(oldSystemName) :
                                new TextInput()
                                    .setStyle(TextInputStyle.Short)
                                    .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.NameType.create())
                                    .setLength({ min: 3, max: 20 })
                                    .setRequired(true)
                        )
                ]
            )
        return await ctx.interaction.modal(form);
    }
}