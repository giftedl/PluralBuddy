/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, FileUpload, Label, Modal, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";

export default class SetPFPButton extends ComponentCommand {
	componentType = 'Button' as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.SetPFP.startsWith(context.customId)
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const { system } = await ctx.retrievePUser()

		if (system === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
			})
		}

		const form = new Modal()
			.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.SystemPFPForm.create())
			.setTitle(ctx.userTranslations().EDIT_SYSTEM_FORM_TITLE)
			.addComponents(
				[
					new Label()
						.setLabel(ctx.userTranslations().ALTER_SET_PFP)
						.setComponent(
							new FileUpload()
								.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.SystemPFPType.create())
								.setRequired(true)
								.setMinValues(1)
								.setMaxValues(1)
						)
				]
			)
		return await ctx.modal(form);
	}
}