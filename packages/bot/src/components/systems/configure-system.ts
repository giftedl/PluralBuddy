/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ComponentCommand, Container, TextDisplay, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "../../lib/interaction-ids";
import { MessageFlags } from "seyfert/lib/types";
import { SystemSettingsView } from "../../views/system-settings";
import { AlertView } from "../../views/alert";

export default class ConfigureSystem extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(ctx: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.ConfigurePublicProfile.startsWith(ctx.customId);
      }

    async run(ctx: ComponentContext<typeof this.componentType>) {
        const originalUserId = InteractionIdentifier.Systems.ConfigurePublicProfile.substring(ctx.customId)[0]
        
        if (ctx.author.id !== originalUserId) {
            return ctx.write({
                components: [
                    new Container()
                        .setComponents(
                            new TextDisplay()
                                .setContent("You are not the original recipient of the message.")
                        )
                ],
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        return await ctx.write({
            components: [
                ...new SystemSettingsView(ctx.userTranslations()).topView("general", user.system.associatedUserId),
                ...new SystemSettingsView(ctx.userTranslations()).generalSettings(user.system, ctx.guildId)

            ],
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral

        })
      }
}