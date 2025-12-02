/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, Label, Modal, StringSelectMenu, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { alterPrivacySelection } from "@/lib/selection-options";

export default class SetPrivacyButton extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(context: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.Alters.SetPrivacy.startsWith(context.customId)
    }

    override async run(ctx: ComponentContext<typeof this.componentType>) {
        const alterId = InteractionIdentifier.Systems.Configuration.Alters.SetPFP.substring(
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
            .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Alters.AlterPFPForm.create(alter.alterId))
            .setTitle(ctx.userTranslations().ALTER_FORM_TITLE)
            .addComponents(
                [
                    new Label()
                        .setLabel(ctx.userTranslations().ALTER_SET_PRIVACY)
                        .setDescription(ctx.userTranslations().TAG_PRIVACY_FORM_DESC)
                        .setComponent(
                            new StringSelectMenu()
                                .setCustomId(InteractionIdentifier.Systems.Configuration.FormSelection.Tags.TagPrivacyType.create())
                                .setOptions(alterPrivacySelection(ctx.userTranslations(), alter.public))
                                .setValuesLength({ min: 0, max: alterPrivacySelection(ctx.userTranslations()).length })
                                .setRequired(false)
                        )
                ]
            )
        return await ctx.modal(form);
    }
}