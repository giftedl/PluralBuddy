import { api } from "@/lib/rpc";
import {
	Command,
	Container,
	Declare,
	Options,
	TextDisplay,
	type CommandContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "stats",
	description: "Get stats about PluralBuddy",
	contexts: ["Guild"],
	guildId: ["1444187699924963350"],
})
export default class InfoCommand extends Command {
	override async run(ctx: CommandContext) {
		const stats = await (await api.stats.$get()).json();

		return await ctx.write({
			components: [
				new Container().setColor("#FCCEE8").setComponents(
					new TextDisplay().setContent(`## PluralBuddy Statistics
> **User Count:** ${stats.userCount}
> **Guild Count:** ${stats.guildCount}

-# Last updated <t:${stats.lastDrip}:R>`),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}
}
