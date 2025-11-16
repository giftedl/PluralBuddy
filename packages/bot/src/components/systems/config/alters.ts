/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { SystemSettingsView } from "@/views/system-settings";

export default class AlterTab extends ComponentCommand {
   componentType = 'Button' as const;
   
    override filter(context: ComponentContext<typeof this.componentType>) {
       return InteractionIdentifier.Systems.Configuration.Alters.Index.equals(context.customId)
    }

    override async run(ctx: ComponentContext<typeof this.componentType>) {
        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return await ctx.update({
            components: [
                ...new SystemSettingsView(ctx.userTranslations()).topView("alters", user.system.associatedUserId),
                ...await new SystemSettingsView(ctx.userTranslations()).altersSettings(user.system)

            ],
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
    }
}