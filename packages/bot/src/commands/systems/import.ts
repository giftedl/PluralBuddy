import { AlertView } from "@/views/alert";
import { LoadingView } from "@/views/loading";
import { CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
    name: "import",
    description: "Import data from another source.",

})
export default class ImportCommand extends SubCommand {
    override async run(ctx: CommandContext) {
        
		await ctx.write({
			components: new LoadingView(ctx.userTranslations()).loadingView(),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});

		const user = await ctx.retrievePUser();

		if (user.system === undefined) {
			return await ctx.editResponse({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_SYSTEM_DOESNT_EXIST",
				),
				flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
			});
		}


		return await ctx.editResponse({
			components: new AlertView(ctx.userTranslations()).successView(
				"SYSTEM_EXPORT_FINISHED",
			),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2,
		});
    }
}