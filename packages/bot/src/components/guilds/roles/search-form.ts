import {
	ComponentCommand,
	Middlewares,
	ModalCommand,
	ModalContext,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { ServerConfigView } from "@/views/server-cfg";

@Middlewares(["ensureGuildPermissions"])
export default class SearchingRolePreferencesForm extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Guilds.FormSelection.SearchingRolePreferencesForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const roleId = ctx.interaction.getInputValue(
			InteractionIdentifier.Guilds.FormSelection.SearchingRolePreferencesSelection.create(),
			true,
		)[0] as string;

        const guild = await ctx.retrievePGuild();
        const roleObj = guild.rolePreferences.find(c => c.roleId === roleId)
        
        if (!roleObj) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ROLE_PREFERENCE_DOESNT_EXIST"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

        return await ctx.interaction.update({
            components: new ServerConfigView(ctx.userTranslations()).roleGeneralView(roleObj),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            allowed_mentions: { parse: [] }
        })
	}
}
