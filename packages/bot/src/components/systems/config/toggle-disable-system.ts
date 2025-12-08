/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */
import { ComponentCommand, type ComponentContext } from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { userCollection } from "@/mongodb";
import { createSystemOperation } from "@/lib/system-operation";
import { SystemSettingsView } from "@/views/system-settings";

export default class ToggleDisableSystemButton extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.ToggleDisableSystem.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const { system } = await ctx.retrievePUser();

		if (system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await createSystemOperation(
			system,
			{ disabled: !system.disabled },
			ctx.userTranslations(),
			"discord",
		);

        system.disabled = !system.disabled;

		return await ctx.update({
			components: [
				...new SystemSettingsView(ctx.userTranslations()).topView(
					"general",
					system.associatedUserId,
				),
				...new SystemSettingsView(ctx.userTranslations()).generalSettings(
					system,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
