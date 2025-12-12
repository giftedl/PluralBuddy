/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { AlterView } from "@/views/alters";

export default class WebhookButton extends ComponentCommand {
   componentType = 'Button' as const;
   
   override filter(context: ComponentContext<typeof this.componentType>) {
       return InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.Both.startsWith(context.customId)
   }

   override async run(ctx: ComponentContext<typeof this.componentType>) {
        const alterId =
            InteractionIdentifier.Systems.Configuration.Alters.ProxyMode.Both.substring(
                ctx.customId,
            )[0];
        const systemId = ctx.author.id
        
        const query = alterCollection.findOne({
			$and: [{ alterId: Number(alterId) }, { systemId }],
        });
        let alter = await query;

        if (alter === null) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_ALTER_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        await alterCollection.updateOne(
            { alterId: Number(alterId), systemId },
            {
                $set: {
                    alterMode: "both"
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
                ...await new AlterView(ctx.userTranslations()).alterGeneralView(alter, ctx.guildId),
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
        });
   }
}