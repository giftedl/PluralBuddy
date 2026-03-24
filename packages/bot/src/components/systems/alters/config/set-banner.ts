/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, FileUpload, Label, Modal, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";

export default class SetPFPButton extends ComponentCommand {
   componentType = 'Button' as const;
   
   override filter(context: ComponentContext<typeof this.componentType>) {
       return InteractionIdentifier.Systems.Configuration.Alters.SetBanner.startsWith(context.customId)
   }

   override async run(ctx: ComponentContext<typeof this.componentType>) {
	const alterId = InteractionIdentifier.Systems.Configuration.Alters.SetBanner.substring(
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
		.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterBannerForm.create(alter.alterId))
		.setTitle(ctx.userTranslations().ALTER_FORM_TITLE)
		.addComponents(
			[
				new Label()
					.setLabel(ctx.userTranslations().ALTER_SET_BANNER)
					.setComponent(
						new FileUpload()
                            .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterBannerType.create())
                            .setRequired(true)
                            .setMinValues(1)
                            .setMaxValues(1)
                    )
                ]
            )
    return await ctx.modal(form);
   }
}