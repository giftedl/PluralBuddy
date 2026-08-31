import { SystemFlags } from "plurography";
import { CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";

@Declare({
	name: "include-pronouns",
	description: "Toggling including pronouns in the webhook name after proxying with an alter.",
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
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
			});
		}

		await createSystemOperation(
			system,
			{
				flags: getSystemFeatures(system).includePronouns
					? getSystemFeatures(system).disable(SystemFlags.INCLUDE_PRONOUNS)
					: getSystemFeatures(system).enable(SystemFlags.INCLUDE_PRONOUNS),
			},
			await ctx.userTranslations(),
			"discord",
			{
				flippedProxyTags: true,
			},
		);

		return await ctx.write({
			components: [
				...new AlertView(await ctx.userTranslations()).successView(
					getSystemFeatures(system).includePronouns
						? "TOGGLED_INCLUDING_PRONOUNS_D"
						: "TOGGLED_INCLUDING_PRONOUNS_E",
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
