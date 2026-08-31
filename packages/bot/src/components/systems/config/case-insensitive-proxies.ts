import { PSystemObject, SystemFlags } from "plurography";
import { ComponentCommand, type ComponentContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import { SystemSettingsView } from "@/views/system-settings";

export default class PublicProfileBtn extends ComponentCommand {
	componentType = "Button" as const;

	override filter(context: ComponentContext<typeof this.componentType>) {
		return InteractionIdentifier.Systems.Configuration.GeneralTab.ToggleCaseInsensitiveProxies.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ComponentContext<typeof this.componentType>) {
		const { system } = await ctx.retrievePUser();

		if (system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		await createSystemOperation(
			system,
			{
				flags: getSystemFeatures(system).caseInsensitiveProxies
					? getSystemFeatures(system).disable(
							SystemFlags.CASE_INSENSITIVE_PROXIES,
						)
					: getSystemFeatures(system).enable(
							SystemFlags.CASE_INSENSITIVE_PROXIES,
						),
			},
			await ctx.userTranslations(),
			"discord",
			{
				flippedCaseInsensitiveProxying: true,
			},
		);

		return await ctx.update({
			components: [
				...new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(system)?.preferAccessiblity,
				).topView("general", system.associatedUserId),
				...(await new SystemSettingsView(
					await ctx.userTranslations(),
					getSystemFeatures(system)?.preferAccessiblity,
				).generalSettings(
					{
						...system,
						flags: getSystemFeatures(system).caseInsensitiveProxies
							? getSystemFeatures(system).disable(
									SystemFlags.CASE_INSENSITIVE_PROXIES,
								)
							: getSystemFeatures(system).enable(
									SystemFlags.CASE_INSENSITIVE_PROXIES,
								),
					},
					ctx.guildId,
					2,
				)),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
