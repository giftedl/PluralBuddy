/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection } from "@/mongodb";

export default class SetUsernameButton extends ComponentCommand {
   componentType = 'Button' as const;
   
   override filter(context: ComponentContext<typeof this.componentType>) {
	   return InteractionIdentifier.Systems.Configuration.Alters.SetUsername.startsWith(context.customId)
   }

   override async run(ctx: ComponentContext<typeof this.componentType>) {
	const alterId = InteractionIdentifier.Systems.Configuration.Alters.SetUsername.substring(
		ctx.customId,
	)[0];

	const systemId = ctx.author.id;
	const query = alterCollection.findOne({
		alterId: Number(alterId),
		systemId,
	});
	const alter = await query;

	if (alter === null) {
		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
		})
	}

	const form = new Modal()
		.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameForm.create(alter.alterId))
		.setTitle(ctx.userTranslations().ALTER_FORM_TITLE)
		.addComponents(
			[
				new Label()
					.setLabel(ctx.userTranslations().SYSTEM_NAME_FORM_LABEL)
					.setComponent(
						new TextInput()
							.setStyle(TextInputStyle.Short)
							.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterUsernameType.create())
							.setLength({ min: 3, max: 20 })
							.setRequired(true)
							.setValue(alter.username)
					)
			]
		)

	return await ctx.modal(form);
   }
}