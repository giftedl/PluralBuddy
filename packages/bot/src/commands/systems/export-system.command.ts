/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { AttachmentBuilder, type CommandContext, Declare, SubCommand } from "seyfert";
import { LoadingView } from "../../views/loading";
import { MessageFlags } from "seyfert/lib/types";
import { AlertView } from "../../views/alert";
import { buildExportPayload } from "../../lib/export";

@Declare({
    name: 'export',
    description: "Exports the system",
    aliases: ["e"]
})
export default class ExportCommand extends SubCommand {
	override async run(ctx: CommandContext) {
        await ctx.write({
            components: new LoadingView(ctx.userTranslations()).loadingView(),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })

        const user = await ctx.retrievePUser();

        if (user.system === undefined) {
            return await ctx.editResponse({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_SYSTEM_DOESNT_EXIST"),
                flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
            })
        }

        await ctx.author.write({
            content: ctx.userTranslations().SYSTEM_EXPORT_DM,
            files: [
                new AttachmentBuilder()
                    .setName('system.json')
                    .setFile("buffer", Buffer.from(await buildExportPayload(user.system)))
            ]
        })

        return await ctx.editResponse({
            components: new AlertView(ctx.userTranslations()).successView("SYSTEM_EXPORT_FINISHED"),
            flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
        })
    }
}