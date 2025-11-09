/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, ComponentCommand, Container, Label, Modal, ModalSubmitInteraction, TextDisplay, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { PluralBuddyIntro } from "../../../views/pluralbuddy-intro";
import { LoadingView } from "../../../views/loading";
import { createdSystems } from "../create-new-system";
import { writeUserById } from "../../../types/user";
import { AlertView } from "../../../views/alert";

export default class NameCNS extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Setup.Pagination.Page3.startsWith(ctx.customId);
      }

    
    async run(ctx: ComponentContext<typeof this.componentType>) {
        await ctx.update({
            components: new LoadingView(ctx.userTranslations()).loadingView(),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
        const oldInteractionId = InteractionIdentifier.Setup.Pagination.Page3.substring(ctx.customId)[0] ?? "";
        const temporarySystem = createdSystems.get(oldInteractionId);
    
        if (temporarySystem === undefined) {
            return ctx.write({ content: ctx.userTranslations().ERROR_INTERACTION_TOO_OLD, flags: MessageFlags.Ephemeral })
        }

        await writeUserById(ctx.author.id, {
            userId: ctx.author.id,
            blacklisted: false,
            // @ts-ignore
            system: {
                associatedUserId: ctx.author.id,
                ...temporarySystem
            }
        })


        return await ctx.editResponse({
            components: new AlertView(ctx.userTranslations()).successView("CREATING_NEW_SYSTEM_SUCCESS"),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
    }
}