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
import { AlterProtectionFlags } from "@/types/alter";

export default class SetPrivacyModal extends ModalCommand {
   
   override filter(context: ModalContext) {
	   return InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPrivacyForm.startsWith(context.customId)
   }

   override async run(ctx: ModalContext) {
	const alterId = InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPrivacyForm.substring(
		ctx.customId,
	)[0];

    const systemId = ctx.author.id;
    const query = alterCollection.findOne({
        alterId: Number(alterId),
        systemId,
    });
    let alter = await query;

	if (alter === null) {
		return await ctx.write({
			components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
		})
	}

	const newTagPrivacy = ctx.interaction.getInputValue(
		InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPrivacyType.create(),
	) as string[] | undefined ?? [];
	
    let privacyFlag = 0;
    privacyFlag = combine(...(
        newTagPrivacy.map((val) => {
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_NAME.create()) {
                return AlterProtectionFlags.NAME;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_DESCRIPTION.create()) {
                return AlterProtectionFlags.DESCRIPTION;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_PRONOUNS.create()) {
                return AlterProtectionFlags.PRONOUNS;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_BANNER.create()) {
                return AlterProtectionFlags.BANNER;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_AVATAR.create()) {
                return AlterProtectionFlags.AVATAR;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_VISIBILITY.create()) {
                return AlterProtectionFlags.VISIBILITY;
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_TAGS.create()) {
                return AlterProtectionFlags.TAGS
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_USERNAME.create()) {
                return AlterProtectionFlags.USERNAME
            }
            if (val === InteractionIdentifier.Selection.PrivacyValues.PRIVACY_MESSAGE_COUNT.create()) {
                return AlterProtectionFlags.MESSAGE_COUNT
            }

            return AlterProtectionFlags.NAME;
        })
    ))

	await alterCollection.updateOne(
		{ alterId: Number(alterId), systemId },
		{
			$set: {
				public: privacyFlag
			},
		},
	);

	alter = await alterCollection.findOne({
		alterId: Number(alterId),
		systemId,
	}) ?? alter;
	
    return await ctx.interaction.update({
        components: [
            ...new AlterView(ctx.userTranslations()).alterTopView(
                "general",
                alter.alterId.toString(),
                alter.username,
            ),
            ...await new AlterView(ctx.userTranslations()).alterGeneralView(
                alter,
                ctx.guildId
            ),
        ],
        flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
    });
   }
}