/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  *//**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { ModalCommand, type ModalContext } from "seyfert";
import { MessageFlags, TextInputStyle } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { createSystemOperation } from "@/lib/system-operation";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import { SystemSettingsView } from "@/views/system-settings";
export default class SetPronounsButton extends ModalCommand {
	override filter(context: ModalContext) {
		return InteractionIdentifier.Systems.Configuration.FormSelection.SystemTagForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {

		let { system } = await ctx.retrievePUser()

		if (system === undefined) {
			return await ctx.write({
				components: new AlertView((await ctx.userTranslations())).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
			})
		}

		const newSystemTag = ctx.interaction.getInputValue(
			InteractionIdentifier.Systems.Configuration.FormSelection.SystemTagType.create(),
			true,
		);

		const newSystem = await createSystemOperation(system, {
			systemDisplayTag: newSystemTag as string
		}, (await ctx.userTranslations()), "discord")

		if (newSystem)
			system = newSystem;

		if (ctx.guildId === undefined)
			return await ctx.interaction.deferUpdate();

		return await ctx.interaction.update({
			components: [
				...new SystemSettingsView((await ctx.userTranslations()), getSystemFeatures(system)?.preferAccessiblity).topView(
					"public-settings",
					system.associatedUserId,
				),
				...new SystemSettingsView((await ctx.userTranslations()), getSystemFeatures(system)?.preferAccessiblity).publicProfile(
					system,
					(await ctx.getDefaultPrefix()) ?? "",
					ctx.interaction?.message?.messageReference === undefined,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
