/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, ComponentCommand, Label, Modal, ModalSubmitInteraction, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";
import { PluralBuddyIntro } from "../../../views/pluralbuddy-intro";

export default class NameCNS extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Setup.CreateNewSystem.Name.startsWith(ctx.customId);
      }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const oldInteractionId = InteractionIdentifier.Setup.CreateNewSystem.Name.substring(ctx.customId);
        const form = new Modal()
            .setCustomId(InteractionIdentifier.Setup.FormSelection.NameForm.create(oldInteractionId))
            .setTitle(ctx.userTranslations().CREATING_NEW_SYSTEM_FORM_TITLE)
            .addComponents(
                [
                    new Label()
                        .setLabel(ctx.userTranslations().SYSTEM_NAME_FORM_LABEL)
                        .setComponent(
                            new TextInput()
                                .setStyle(TextInputStyle.Short)
                                .setCustomId(InteractionIdentifier.Setup.FormSelection.NameType.create())
                                .setLength({ min: 3, max: 20 })
                                .setRequired(true)
                        )
                ]
            )
        return await ctx.interaction.modal(form);
    }

}