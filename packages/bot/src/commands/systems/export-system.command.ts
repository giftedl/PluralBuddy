/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { AttachmentBuilder, type CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { buildExportPayload } from "@/lib/export";
import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";

@Declare({
	name: "export",
	description: "Exports the system",
	aliases: ["e"],
	contexts: ["BotDM", "Guild"],
})
export default class ExportCommand extends SubCommand {
	override async run(ctx: CommandContext) {
		await ctx.write({
			components: new LoadingView(await ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}

		return await ctx.ephemeral(
			{
				components: new AlertView(await ctx.userTranslations()).successView(
					"SYSTEM_EXPORT_FINISHED",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			},
			false,
			async (ctx) => {
				if (user.system)
					await ctx.followup?.({
						files: [
							new AttachmentBuilder()
								.setName("system.json")
								.setFile(
									"buffer",
									Buffer.from(await buildExportPayload(user.system)),
								),
						],
						flags: MessageFlags.Ephemeral,
					});
			},
			ctx,
		);
	}
}
