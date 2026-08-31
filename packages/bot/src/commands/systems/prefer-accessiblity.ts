import { SystemFlags } from "plurography";
import { CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";

@Declare({
	name: "prefer-accessiblity",
	description:
		"PluralBuddy will prefer accessiblity over looks/data visiblity.",
})
export default class IncludeProxyTags extends SubCommand {
	override async run(ctx: CommandContext) {
		const { system } = await ctx.retrievePUser();

		if (system === undefined) {
			return await ctx.write({
				components: [
					...new AlertView(await ctx.userTranslations()).errorView(
						"ERROR_SYSTEM_DOESNT_EXIST",
					),
				],
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		await createSystemOperation(
			system,
			{
				flags: getSystemFeatures(system).preferAccessiblity
					? getSystemFeatures(system).disable(SystemFlags.PREFER_ACCESSIBLITY)
					: getSystemFeatures(system).enable(SystemFlags.PREFER_ACCESSIBLITY),
			},
			await ctx.userTranslations(),
			"discord",
			{
				flippedPreferAccessiblity: true,
			},
		);

		return await ctx.write({
			components: [
				...new AlertView(await ctx.userTranslations()).successView(
					getSystemFeatures(system).preferAccessiblity
						? "PREFER_ACCESSIBLITY_E"
						: "PREFER_ACCESSIBLITY_D",
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
