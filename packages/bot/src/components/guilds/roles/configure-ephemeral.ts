import { ComponentCommand, Middlewares, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { ServerConfigView } from "@/views/server-cfg";

@Middlewares(["ensureGuildPermissions"])
export default class ConfigureRoleButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Guilds.RolesTab.PreferenceEphemeral.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
        const roleId = InteractionIdentifier.Guilds.RolesTab.PreferenceEphemeral.substring(ctx.customId)[0] ?? "";
        const guild = await ctx.retrievePGuild();
        const roleObj = guild.rolePreferences.find(c => c.roleId === roleId)
        
        if (!roleObj) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ROLE_PREFERENCE_DOESNT_EXIST"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

        return await ctx.write({
            components: new ServerConfigView(ctx.userTranslations()).roleGeneralView(roleObj),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            allowed_mentions: { parse: [] }
        })
    }
}
