/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection } from "@/mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";

export default class SetProxyMode extends ComponentCommand {
   componentType = 'Button' as const;
   
   override filter(context: ComponentContext<typeof this.componentType>) {
       return InteractionIdentifier.Systems.Configuration.Alters.SetProxyMode.startsWith(context.customId)
   }

   override async run(context: ComponentContext<typeof this.componentType>) {
		const alterId =
            InteractionIdentifier.Systems.Configuration.Alters.SetProxyMode.substring(
                context.customId,
            )[0];

        const systemId = context.author.id;
        const query = alterCollection.findOne({
            alterId: Number(alterId),
            systemId,
        });
        const alter = await query;

        if (alter === null) {
            return await context.write({
                components: new AlertView(context.userTranslations()).errorView(
                    "ERROR_ALTER_DOESNT_EXIST",
                ),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
            });
        }

        return await context.update({
            components: [
                ...new AlterView(context.userTranslations()).altersSetMode(alter.username, alter.alterId, alter.alterMode)
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
   }
}