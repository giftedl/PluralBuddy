/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, StringSelectMenu, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { privacySelection } from "../../../lib/selection-options";
import { AlertView } from "../../../views/alert";
import { has } from "../../../lib/privacy-bitmask";
import { SystemProtectionFlags } from "../../../types/system";

export default class SetName extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.GeneralTab.SetPrivacy.equals(ctx.customId)  
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const oldSystemPrivacy = (await ctx.retrievePUser()).system?.public

        if (oldSystemPrivacy === undefined) {
            return await ctx.interaction.update({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
          }
        
        const form = new Modal()
            .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.PrivacyForm.create())
            .setTitle(ctx.userTranslations().EDIT_SYSTEM_FORM_TITLE)
            .addComponents(
                [
                    new Label()
                        .setLabel(ctx.userTranslations().SYSTEM_PRIVACY_FORM_LABEL)
                        .setDescription(ctx.userTranslations().CREATING_NEW_SYSTEM_PRIVACY_FORM_DESC)
                        .setComponent(
                            new StringSelectMenu()
                                .setCustomId(InteractionIdentifier.Setup.FormSelection.PrivacyType.create())
                                .setOptions(
                                    privacySelection(ctx.userTranslations(), oldSystemPrivacy)
                                )
                                .setValuesLength({ min: 0, max: privacySelection(ctx.userTranslations()).length })
                                .setRequired(false)
                                
                        )
                ]
            )
        return await ctx.interaction.modal(form);
    }
}