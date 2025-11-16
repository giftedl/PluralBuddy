/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { getUserById, writeUserById } from "@/types/user";

export default class RemoveAlterButton extends ComponentCommand {
   componentType = 'Button' as const;
   
   override filter(context: ComponentContext<typeof this.componentType>) {
       return InteractionIdentifier.Systems.Configuration.Alters.RemoveAlterConfirm.startsWith(context.customId)
   }

    override async run(ctx: ComponentContext<typeof this.componentType>) {
        const alterId = InteractionIdentifier.Systems.Configuration.Alters.RemoveAlterConfirm.substring(
            ctx.customId,
        )[0];

        const systemId = ctx.author.id;
        const query = alterCollection.findOne({
			$and: [{ alterId: Number(alterId) }, { systemId }],
        });
        const alter = await query;

        if (alter === null) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        await alterCollection.findOneAndDelete(
            { alterId: Number(alter.alterId), systemId },
        );
        
        await userCollection.updateOne(
            { userId: ctx.author.id },
            { $pull: { "system.alters": { alterId: Number(alterId) } } }
        )

        return await ctx.update({
            components: new AlertView(ctx.userTranslations()).successView("ALTER_DELETION_FINISHED"),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
    }
}