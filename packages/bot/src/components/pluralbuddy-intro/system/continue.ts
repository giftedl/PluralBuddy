/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ActionRow, Button, ComponentCommand, Container, Label, Modal, ModalSubmitInteraction, TextDisplay, TextInput, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { ButtonStyle, MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { PluralBuddyIntro } from "../../../views/pluralbuddy-intro";
import { LoadingView } from "../../../views/loading";
import { createdSystems } from "../create-new-system";
import { writeUserById } from "../../../types/user";
import { AlertView } from "../../../views/alert";
import { emojis } from "@/lib/emojis";

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
        const server = await ctx.retrievePGuild()
    
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
            components: [
                ...new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().CREATING_NEW_SYSTEM_SUCCESS.replaceAll("%prefix%", server.prefixes[0] ?? "!")),
                new ActionRow()
                    .setComponents(
                        new Button()
                            .setCustomId(InteractionIdentifier.Systems.Configuration.GeneralTab.Index.create())
                            .setLabel("Configure Alter")
                            .setEmoji(emojis.wrenchWhite)
                            .setStyle(ButtonStyle.Primary)
                    )
            ],
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
    }
}