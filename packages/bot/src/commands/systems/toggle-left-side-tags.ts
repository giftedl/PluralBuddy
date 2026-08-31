import { SystemFlags } from "plurography";
import { CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";

@Declare({
	name: "toggle-left-tags",
	description: "Toggling left side display tags on webhook names.",
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
				flags: getSystemFeatures(system).leftSidedTag
					? getSystemFeatures(system).disable(SystemFlags.LEFT_SIDED_TAG)
					: getSystemFeatures(system).enable(SystemFlags.LEFT_SIDED_TAG),
			},
			await ctx.userTranslations(),
			"discord",
			{
				flippedNoTypingStatus: true,
			},
		);

		return await ctx.write({
			components: [
				...new AlertView(await ctx.userTranslations()).successView(
					getSystemFeatures(system).leftSidedTag
						? "TOGGLED_LEFT_SIDED_TAGS_D"
						: "TOGGLED_LEFT_SIDED_TAGS_E",
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
