import { SystemFlags } from "plurography";
import { type CommandContext, Declare, Group, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { getSystemFeatures } from "@/lib/get-system-flags";
import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import { Shortcut } from "yunaforseyfert";

@Declare({
	name: "public-default",
	description:
		"PluralBuddy will create all tags or alters publicly by default.",
})
@Group("settings")
@Shortcut()
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
				flags: getSystemFeatures(system).publicDefault
					? getSystemFeatures(system).disable(SystemFlags.PUBLIC_DEFAULT)
					: getSystemFeatures(system).enable(SystemFlags.PUBLIC_DEFAULT),
			},
			await ctx.userTranslations(),
			"discord",
			{
				flippedPublicDefault: true,
			},
		);

		return await ctx.write({
			components: [
				...new AlertView(await ctx.userTranslations()).successView(
					getSystemFeatures(system).publicDefault
						? "PUBLIC_DEFAULT_D"
						: "PUBLIC_DEFAULT_E",
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
