import { emojis } from "@/lib/emojis";
import { Command, Container, Declare, Options, TextDisplay, type CommandContext } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {};

@Declare({
	name: "ping",
	description: "Get ping of PluralBuddy. ",
})
@Options(options)
export default class SystemCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {

		const wsPing = Math.floor(ctx.client.gateway.latency);
		const clientPing = Math.floor(
			Date.now() - (ctx.message ?? ctx.interaction).createdTimestamp,
		);

        return await ctx.write({
            components: [
                new Container().setComponents(
                    new TextDisplay().setContent(`**${emojis.catjamming}   PluralBuddy \`${process.env.BRANCH ?? "unknown"}\`**
> **Ping:** \`${wsPing}\`/\`${clientPing}\` (ws/api)`)
                ).setColor("#ed4b9b")
            ],
            flags: MessageFlags.IsComponentsV2
        })
    }
}