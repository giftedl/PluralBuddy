import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { SystemSettingsView } from "@/views/system-settings";

export default class TagButton extends ComponentCommand {
    componentType = 'Button' as const;

    override filter(context: ComponentContext<typeof this.componentType>) {
        return InteractionIdentifier.Systems.Configuration.Tags.Index.startsWith(context.customId)
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
                ...await new SystemSettingsView(ctx.userTranslations()).tagsSettings(user.system)

            ],
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
    }
}