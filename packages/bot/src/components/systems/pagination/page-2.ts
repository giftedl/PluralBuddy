/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Container, TextDisplay, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../../lib/interaction-ids";
import { MessageFlags } from "seyfert/lib/types";
import { SystemSettingsView } from "../../../views/system-settings";
import { AlertView } from "../../../views/alert";

export default class ConfigureSystem extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.Pagination.PageTwo.startsWith(ctx.customId);
      }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        await ctx.deferUpdate();

        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await ctx.editResponse({
                components: new AlertView((await ctx.userTranslations())).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return await ctx.editResponse({
            components: [
                ...new SystemSettingsView((await ctx.userTranslations())).topView("general", user.system.associatedUserId),
                ...(await new SystemSettingsView((await ctx.userTranslations())).generalSettings(user.system, ctx.guildId, 2))
            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral

        })
      }
}