/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { messages } from "@/messages";
import { Declare, Options, Command, type CommandContext, createChannelOption, createStringOption } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    type: createStringOption({
        description: "Type of message to use",
        choices: Object.keys(messages).map(c => { return { name: c, value: c }}),
        required: true
    }),
    channel: createChannelOption({
        description: "Channel to put the message in",
    })
};

@Declare({
    name: "info",
    description: "Info command",
    contexts: ["Guild"],
    guildId: ["1444187699924963350"],
})
@Options(options)
export default class InfoCommand extends Command {
    override async run(ctx: CommandContext<typeof options>) {
		if (!ctx.member?.roles.keys.includes("1444241245634433134")) {
			return;
		}
        const { channel, type } = ctx.options;
        const messageFunc = messages[type as keyof typeof messages]

        if (channel !== undefined && channel.isTextGuild()) {
            channel.messages.write({
                components: messageFunc(),
                flags: MessageFlags.IsComponentsV2
            })

            return await ctx.write({ content: "Done!" })
        }
        
        return await ctx.write({
            components: messageFunc(),
            flags: MessageFlags.IsComponentsV2
        })
    }
}