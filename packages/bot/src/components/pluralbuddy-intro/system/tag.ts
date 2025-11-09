/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, ComponentCommand, type ComponentContext, Label, Modal, TextInput } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { TextInputStyle } from "seyfert/lib/types";

export default class TagCNS extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Setup.CreateNewSystem.SystemTag.startsWith(ctx.customId);
      }
    
      async run(ctx: ComponentContext<typeof this.componentType>) {
        const oldInteractionId = InteractionIdentifier.Setup.CreateNewSystem.SystemTag.substring(ctx.customId);
        const form = new Modal()
            .setCustomId(InteractionIdentifier.Setup.FormSelection.TagForm.create(oldInteractionId))
            .setTitle(ctx.userTranslations().CREATING_NEW_SYSTEM_FORM_TITLE)
            .addComponents(
                [
                    new Label()
                        .setLabel(ctx.userTranslations().SYSTEM_TAG_FORM_LABEL)
                        .setComponent(
                            new TextInput()
                                .setStyle(TextInputStyle.Short)
                                .setCustomId(InteractionIdentifier.Setup.FormSelection.TagType.create())
                                .setLength({ max: 20 })
                                .setRequired(true)
                        )
                ]
            )
        return await ctx.interaction.modal(form);
    }
}