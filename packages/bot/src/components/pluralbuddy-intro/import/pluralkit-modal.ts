/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, ModalCommand, type ModalContext, type ComponentContext, ActionRow, Button } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { LoadingView } from "../../../views/loading";
import { ButtonStyle, MessageFlags } from "seyfert/lib/types";
import { PSystemObject } from "../../../types/system";
import { ImportNotation } from "../../../lib/export";
import { AlertView } from "../../../views/alert";
import { parse, z } from "zod";
import { PluralKitSystem } from "pluralkit-types";

export default class PluralBuddyImportModal extends ModalCommand {
    override filter(ctx: ModalContext) {
        return InteractionIdentifier.Setup.FormSelection.PkForm.equals(ctx.customId);
      }

    
    async run(ctx: ModalContext) {
        await ctx.interaction.update({
            components: new LoadingView(ctx.userTranslations()).loadingView(),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })

        const value = ctx.interaction.getInputValue(InteractionIdentifier.Setup.FormSelection.PkType.create(), true) as string
        const parsed = PluralKitSystem.safeParse(JSON.parse(value));

        if (parsed.error) {
            return await ctx.editResponse({
                components: [
                    ...new AlertView(ctx.userTranslations()).errorViewCustom(ctx.userTranslations().PLURALBUDDY_IMPORT_ERROR.replace("%zod_errors%", z.prettifyError(parsed.error))),
                    new ActionRow().addComponents(
                        new Button()
                            .setLabel(ctx.userTranslations().PAGINATION_PREVIOUS_PAGE)
                            .setCustomId(InteractionIdentifier.Setup.Pagination.Page2.create())
                            .setStyle(ButtonStyle.Secondary)
                    )
                ],
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

    }
}