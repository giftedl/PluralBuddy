import { getSystemFeatures } from "@/lib/get-system-flags";
import { createSystemOperation } from "@/lib/system-operation";
import { AlertView } from "@/views/alert";
import { SystemFlags } from "plurography";
import { type CommandContext, Declare, Group, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Shortcut } from "yunaforseyfert";

@Declare({
	name: "toggle-typing-status",
	description: "Toggling typing status after proxying.",
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
				flags: getSystemFeatures(system).noTypingStatus
					? getSystemFeatures(system).disable(SystemFlags.NO_TYPING_STATUS)
					: getSystemFeatures(system).enable(SystemFlags.NO_TYPING_STATUS),
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
					getSystemFeatures(system).noTypingStatus
						? "TOGGLED_TYPING_STATUS_D"
						: "TOGGLED_TYPING_STATUS_E",
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
