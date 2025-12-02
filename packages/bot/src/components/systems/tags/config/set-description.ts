/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection, tagCollection } from "@/mongodb";

export default class SetUsernameButton extends ComponentCommand {
	componentType = 'Button' as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.Tags.SetDescription.startsWith(context.customId)
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const tagId = InteractionIdentifier.Systems.Configuration.Tags.SetDescription.substring(
			ctx.customId,
		)[0];

		const systemId = ctx.author.id;
		const query = tagCollection.findOne({
			tagId,
			systemId,
		});
		const tag = await query;

		if (tag === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView("ERROR_TAG_DOESNT_EXIST"),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
			})
		}

		const form = new Modal()
			.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagDescriptionForm.create(tag.tagId))
			.setTitle(ctx.userTranslations().ALTER_FORM_TITLE)
			.addComponents(
				[
					new Label()
						.setLabel(ctx.userTranslations().SYSTEM_DESCRIPTION_FORM_LABEL)
						.setComponent(
							tag.tagDescription === undefined ? new TextInput()
								.setStyle(TextInputStyle.Paragraph)
								.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagDescriptionType.create())
								.setLength({ min: 3, max: 2000 })
								.setRequired(true) : new TextInput()
									.setStyle(TextInputStyle.Paragraph)
									.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagDescriptionType.create())
									.setLength({ min: 3, max: 2000 })
									.setRequired(true)
									.setValue(tag.tagDescription)
						)
				]
			)

		return await ctx.modal(form);
	}
}