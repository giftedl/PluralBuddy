/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection } from "@/mongodb";

export default class SetUsernameButton extends ComponentCommand {
   componentType = 'Button' as const;
   
   override filter(context: ComponentContext<typeof this.componentType>) {
	   return InteractionIdentifier.Systems.Configuration.SetDescription.startsWith(context.customId)
   }

   override async run(ctx: ComponentContext<typeof this.componentType>) {
    const user = await ctx.retrievePUser()

    if (user.system === undefined) {
      return await ctx.interaction.update({
          components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
          flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
      })
    }

	const form = new Modal()
		.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.SystemDescriptionForm.create())
		.setTitle(ctx.userTranslations().EDIT_SYSTEM_FORM_TITLE)
		.addComponents(
			[
				new Label()
					.setLabel(ctx.userTranslations().SYSTEM_DESCRIPTION_FORM_LABEL)
					.setComponent(
						user.system.systemDescription === undefined ? new TextInput()
							.setStyle(TextInputStyle.Paragraph)
							.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.SystemDescriptionType.create())
							.setLength({ min: 3, max: 2000 })
							.setRequired(true) : new TextInput()
							.setStyle(TextInputStyle.Paragraph)
							.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.SystemDescriptionType.create())
							.setLength({ min: 3, max: 2000 })
							.setRequired(true)
							.setValue(user.system.systemDescription)
					)
			]
		)

	return await ctx.modal(form);
   }
}