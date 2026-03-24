/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, ComponentCommand, Label, Modal, ModalSubmitInteraction, StringSelectMenu, StringSelectOption, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";
import { PluralBuddyIntro } from "../../../views/pluralbuddy-intro";
import { privacySelection } from "../../../lib/selection-options";

export default class NameCNS extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Setup.CreateNewSystem.Privacy.startsWith(ctx.customId);
      }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const oldInteractionId = InteractionIdentifier.Setup.CreateNewSystem.Privacy.substring(ctx.customId);
        const form = new Modal()
            .setCustomId(InteractionIdentifier.Setup.FormSelection.PrivacyForm.create(oldInteractionId))
            .setTitle((await ctx.userTranslations()).CREATING_NEW_SYSTEM_FORM_TITLE)
            .addComponents(
                [
                    new Label()
                        .setLabel((await ctx.userTranslations()).SYSTEM_PRIVACY_FORM_LABEL)
                        .setDescription((await ctx.userTranslations()).CREATING_NEW_SYSTEM_PRIVACY_FORM_DESC)
                        .setComponent(
                            new StringSelectMenu()
                                .setCustomId(InteractionIdentifier.Setup.FormSelection.PrivacyType.create())
                                .setOptions(
                                    privacySelection((await ctx.userTranslations()))
                                )
                                .setValuesLength({ min: 0, max: privacySelection((await ctx.userTranslations())).length })
                                .setRequired(false)
                        )
                ]
            )
        return await ctx.interaction.modal(form);
    }

}