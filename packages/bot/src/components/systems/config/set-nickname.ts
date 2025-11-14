/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { AlertView } from "../../../views/alert";

export default class SetName extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.GeneralTab.SetNicknameFormat.equals(ctx.customId)  
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const oldSystemName = (await ctx.retrievePUser()).system?.systemName

        if (oldSystemName === undefined) {
            return await ctx.interaction.update({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
          }

        const nicknameFormat = (await ctx.retrievePUser()).system?.nicknameFormat
        
        const form = new Modal()
            .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.NicknameForm.create())
            .setTitle(ctx.userTranslations().EDIT_SYSTEM_FORM_TITLE)
            .addComponents(
                [
                    new Label()
                        .setLabel(ctx.userTranslations().SYSTEM_NICKNAME_FORM_LABEL)
                        .setDescription(ctx.userTranslations().SYSTEM_NICKNAME_FORM_DESC)
                        .setComponent(
                            new TextInput()
                                .setStyle(TextInputStyle.Short)
                                .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.NicknameType.create())
                                .setLength({ min: 1, max: 40 })
                                .setRequired(true)
                                .setValue(nicknameFormat ?? "@%username%")
                        )
                ]
            )
        return await ctx.interaction.modal(form);
    }
}