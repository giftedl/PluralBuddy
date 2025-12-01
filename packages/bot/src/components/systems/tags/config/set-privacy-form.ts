/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { alterCollection, tagCollection } from "@/mongodb";
import { AlterView } from "@/views/alters";
import { TagView } from "@/views/tags";
import { TagProtectionFlags } from "@/types/tag";
import { combine } from "@/lib/privacy-bitmask";

export default class SetUsernameButton extends ModalCommand {
   
   override filter(context: ModalContext) {
	   return InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagPrivacyForm.startsWith(context.customId)
   }

   override async run(ctx: ModalContext) {
	const tagId = InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagPrivacyForm.substring(
		ctx.customId,
	)[0];

	const systemId = ctx.author.id;
	const query = tagCollection.findOne({
		tagId,
		systemId,
	});
	let tag = await query;

	if (tag === null) {
		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).errorView("ERROR_TAG_DOESNT_EXIST"),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
		})
	}

	const newTagPrivacy = ctx.interaction.getInputValue(
		InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagPrivacyType.create(),
	) as string[] | undefined ?? [];
	
    let privacyFlag = 0;
    privacyFlag = combine(...(
        newTagPrivacy.map((val) => {
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_NAME.create()) {
                return TagProtectionFlags.NAME;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_ALTERS.create()) {
                return TagProtectionFlags.ALTERS;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_COLOR.create()) {
                return TagProtectionFlags.COLOR;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_DESCRIPTION.create()) {
                return TagProtectionFlags.DESCRIPTION;
            }

            return TagProtectionFlags.ALTERS;
        })
    ))

	await tagCollection.updateOne(
		{ tagId, systemId },
		{
			$set: {
				public: privacyFlag
			},
		},
	);

	tag = await tagCollection.findOne({
		tagId,
		systemId,
	}) ?? tag;
	
	return await ctx.interaction.update({
		components: [
			...new TagView(ctx.userTranslations()).tagTopView(
				"general",
				tag.tagId.toString(),
				tag.tagFriendlyName,
			),
			...new TagView(ctx.userTranslations()).tagGeneral(tag),
		],
		flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
	});
   }
}