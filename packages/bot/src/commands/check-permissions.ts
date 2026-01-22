import { AlertView } from "@/views/alert";
import { Command, CommandContext, Declare, Message } from "seyfert";
import { MessageFlags, PermissionFlagsBits } from "seyfert/lib/types";

@Declare({
    name: "checkpermissions",
    description: "Ensure PluralBuddy has the proper permissions.",
    aliases: ["bot", "app", "explain"],
    defaultMemberPermissions: ["ManageRoles"]
})
export default class AppExplanationCommand extends Command {
    override async run(ctx: CommandContext) {
        const guild = await ctx.retrievePGuild();

        if (guild.getFeatures().disabledAppExplain) {
            if (ctx.isChat() && ctx.message) {
                (ctx.message as Message).delete()

                await (ctx.message as Message).author.write({
                    components: new AlertView(ctx.userTranslations()).errorView("FEATURE_DISABLED_GUILD"),
                    flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
                })
                return;
            }

            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("FEATURE_DISABLED_GUILD"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }
        
        return await ctx.write({
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
            components: []
        })
    }
}