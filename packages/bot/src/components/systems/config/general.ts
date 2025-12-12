/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { SystemSettingsView } from "../../../views/system-settings";
import { AlertView } from "../../../views/alert";
import { MessageFlags } from "seyfert/lib/types";

export default class GeneralTab extends ComponentCommand {
    componentType = 'Button' as const;


    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.GeneralTab.Index.equals(ctx.customId)  
    }

    async run(ctx: ComponentContext<typeof this.componentType>) {

        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await ctx.ephemeral({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return await ctx.update({
            components: [
                ...new SystemSettingsView(ctx.userTranslations()).topView("general", user.system.associatedUserId),
                ...new SystemSettingsView(ctx.userTranslations()).generalSettings(user.system, ctx.guildId)

            ],
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
    }
}