import { AlertView } from "@/views/alert";
import { CommandContext, Declare, SubCommand } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
    name: "flush-msg-cache",
    description: "Flush legacy message cache",
    guildId: ["1444187699924963350"],
})
export default class FlushMessageCache extends SubCommand {
    override async run(ctx: CommandContext) {
        if (ctx.author.id !== "1252031635692720224")
            return await ctx.write({
                content: "Nuh uh"
            })

        await ctx.deferReply()

        const guilds = (await ctx.client.guilds.list({}, true)) ?? [];

        for (const guild of guilds)
            await ctx.client.cache.messages?.flush(guild.id)

        return await ctx.editResponse({
            components: new AlertView(await ctx.userTranslations()).successViewCustom("Message cache flushed!"),
            flags: MessageFlags.IsComponentsV2
        })
    }
}