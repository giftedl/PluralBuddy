import { getSystemFeatures } from "@/lib/get-system-flags";
import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import { SystemFlags } from "plurography";
import { type CommandContext, Declare, Group, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Shortcut } from "yunaforseyfert";

@Declare({
	name: "include-proxy-tags",
	description: "Toggling including proxy tags after proxying with an alter.",
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
				flags: getSystemFeatures(system).keepProxyTags
					? getSystemFeatures(system).disable(SystemFlags.KEEP_PROXY_TAGS)
					: getSystemFeatures(system).enable(SystemFlags.KEEP_PROXY_TAGS),
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
					getSystemFeatures(system).keepProxyTags
						? "TOGGLED_INCLUDING_PROXY_TAGS_D"
						: "TOGGLED_INCLUDING_PROXY_TAGS_E",
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
