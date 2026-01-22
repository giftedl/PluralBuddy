import { guildCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { Middlewares, Group, SubCommand, Declare, CommandContext, createStringOption, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    "new-prefix": createStringOption({
        description: "New prefix to use.",
        required: true
    })
}

@Declare({
    name: "add",
    description: "Add a new server prefix.",
    aliases: ["a"],
})
@Middlewares(["ensureGuildPermissions"])
@Group("prefixes")
@Options(options)
export default class AddPrefixCommand extends SubCommand {
    override async run(ctx: CommandContext<typeof options>) {
        const guildObj = await ctx.retrievePGuild();
        const { "new-prefix": newPrefix } = ctx.options;

        if (guildObj.prefixes.includes(newPrefix)) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("PREFIX_ALREADY_EXISTS"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

        guildObj.prefixes.push(newPrefix)

        await guildCollection.updateOne({ guildId: guildObj.guildId }, { $push: { prefixes: newPrefix } });

        return await ctx.write({
            components: new AlertView(ctx.userTranslations()).successViewCustom(ctx.userTranslations().SUCCESS_CHANGED_SERVER_PREFIXES.replace("%prefixes%", guildObj.prefixes.map((c) => `> - ${c}`).join("\n"))),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
    }
}