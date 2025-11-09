/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, ComponentCommand, Container, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../lib/interaction-ids";
import { getOperationById } from "../../types/operation";
import { ButtonStyle, MessageFlags, type APIContainerComponent } from "seyfert/lib/types";
import { emojis } from "../../lib/emojis";
import { AlertView } from "../../views/alert";
import { LoadingView } from "../../views/loading";
import { getUserById, writeUserById } from "../../types/user";
import { createTextChangeRange } from "typescript";

export default class UndoOperationButton extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.UndoOperation.startsWith(ctx.customId);
      }
    
    async run(ctx: ComponentContext<typeof this.componentType>) {
        const operationId = InteractionIdentifier.Systems.UndoOperation.substring(ctx.customId)[0];
        const operation = await getOperationById(operationId as string);

        if (operation === null) {
            return await ctx.update({
                components: [
                    new Container(ctx.interaction.message.components[0]?.toJSON() as APIContainerComponent),
                    new ActionRow().setComponents(
                        new Button()
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("b")
                            .setLabel("Expired")
                            .setEmoji(emojis.xWhite)
                    )
                ]
            })
        }

        await ctx.write({
            components: new LoadingView(ctx.userTranslations()).loadingView(),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
        
        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await ctx.editResponse({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        await writeUserById(user.system.associatedUserId, {
            ...(await getUserById(user.userId)),
            system: {
                ...user.system,
                ...operation.oldSystem
            }
        })

        await ctx.editResponse({
            components: new AlertView(ctx.userTranslations())
                .successViewCustom(ctx.userTranslations().OPERATION_UNDO_SUCCESS
                    .replace("%value-count%", operation.changedOperationStrings.length.toString())),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
        
        await ctx.interaction.message.delete();
    }
}