import { ActionRow, Button, ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";
import { emojis } from "@/lib/emojis";

export default class DeleteAlterButton extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(context: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.Alters.DeleteAlter.startsWith(context.customId)
    }

    override async run(ctx: ComponentContext<typeof this.componentType>) {

        const alterId =
            InteractionIdentifier.Systems.Configuration.Alters.DeleteAlter.substring(
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
                components: new AlertView(ctx.userTranslations()).errorView(
                    "ERROR_ALTER_DOESNT_EXIST",
                ),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
            });
        }

        return await ctx.update({
            components: [
                ...new AlertView(ctx.userTranslations()).questionViewCustom(ctx.userTranslations().CONFIRMATION_ALTER_DELETION.replace("%alter%", alter.username)),

                new ActionRow()
                    .setComponents(
                        new Button()
                            .setEmoji(emojis.undo)
                            .setStyle(ButtonStyle.Secondary)
                            .setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
                            .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.GeneralSettings.create(alter.alterId)),
                        new Button()
                            .setEmoji(emojis.circleQuestionWhite)
                            .setStyle(ButtonStyle.Primary)
                            .setLabel(ctx.userTranslations().CONFIRMATION_SYSTEM_DELETION_BTN)
                            .setCustomId(InteractionIdentifier.Systems.Configuration.Alters.RemoveAlterConfirm.create(alter.alterId))
                    )
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
    }
}