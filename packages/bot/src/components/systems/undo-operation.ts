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
        await ctx.deferUpdate();
        const operationId = InteractionIdentifier.Systems.UndoOperation.substring(ctx.customId)[0];
        const operation = await getOperationById(operationId as string);

        if (operation === null) {
            return await ctx.editResponse({
                components: [
                    new Container(ctx.interaction.message.components[0]?.toJSON() as APIContainerComponent),
                    new ActionRow().setComponents(
                        new Button()
                            .setDisabled(true)
                            .setStyle(ButtonStyle.Danger)
                            .setCustomId("b")
                            .setLabel((await ctx.userTranslations()).EXPIRED)
                            .setEmoji(emojis.xWhite)
                    )
                ]
            })
        }

        const followup = await ctx.followup({
            components: new LoadingView((await ctx.userTranslations())).loadingView(),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
        
        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await followup.edit({
                components: new AlertView((await ctx.userTranslations())).errorView("ERROR_SYSTEM_DOESNT_EXIST")
            })
        }

        await writeUserById(user.system.associatedUserId, {
            ...(await getUserById(user.userId)),
            system: {
                ...user.system,
                ...operation.oldSystem
            }
        })

        await followup.edit({
            components: new AlertView((await ctx.userTranslations()))
                .successViewCustom((await ctx.userTranslations()).OPERATION_UNDO_SUCCESS
                    .replace("%value-count%", operation.changedOperationStrings.length.toString()))
        })
        
        await ctx.interaction.message.delete();
    }
}