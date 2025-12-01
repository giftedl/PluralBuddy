/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Label, Modal, StringSelectMenu, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection, tagCollection } from "@/mongodb";
import { tagColorSelection, tagPrivacySelection } from "@/lib/selection-options";

export default class SetUsernameButton extends ComponentCommand {
   componentType = 'Button' as const;
   
   override filter(context: ComponentContext<typeof this.componentType>) {
	   return InteractionIdentifier.Systems.Configuration.Tags.SetPrivacy.startsWith(context.customId)
   }

   override async run(ctx: ComponentContext<typeof this.componentType>) {
	const tagId = InteractionIdentifier.Systems.Configuration.Tags.SetPrivacy.substring(
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
		.setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagPrivacyForm.create(tag.tagId))
		.setTitle(ctx.userTranslations().TAG_FORM_TITLE)
		.addComponents(
			[
				new Label()
					.setLabel(ctx.userTranslations().TAG_PRIVACY_FORM_LABEL)
                    .setDescription(ctx.userTranslations().TAG_PRIVACY_FORM_DESC)
					.setComponent(
                        new StringSelectMenu()
                            .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagPrivacyType.create())
                            .setOptions(tagPrivacySelection(ctx.userTranslations(), tag.public))
                            .setValuesLength({ min: 0, max: tagPrivacySelection(ctx.userTranslations()).length })
                            .setRequired(false)
					)
			]
		)

	return await ctx.modal(form);
   }
}