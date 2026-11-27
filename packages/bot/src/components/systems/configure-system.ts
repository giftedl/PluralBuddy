/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
	ComponentCommand,
	type ComponentContext,
	Container,
	TextDisplay,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";

export default class ConfigureSystem extends ComponentCommand {
	componentType = "Button" as const;

	override filter(ctx: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.ConfigurePublicProfile.startsWith(
			ctx.customId,
		);
	}

	async run(ctx: ComponentContext<typeof this.componentType>) {
		await ctx.deferReply(true);
		const originalUserId =
			InteractionIdentifier.Systems.ConfigurePublicProfile.substring(
				ctx.customId,
			)[0];
		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editOrReply({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		if (
			ctx.author.id !== originalUserId &&
			!(user.system.verifiedSubAccounts ?? []).includes(ctx.author.id)
		) {
			return ctx.editOrReply({
				components: [
					new Container().setComponents(
						new TextDisplay().setContent(
							(await ctx.userTranslations()).NOT_ORIGINAL_RECIPIENT,
						),
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		return await ctx.editOrReply({
			components: [
				...new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(user.system)?.preferAccessiblity,
				).topView("general", user.system.associatedUserId),
				...(await new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(user.system)?.preferAccessiblity,
				).generalSettings(user.system, ctx.guildId, 1)),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
