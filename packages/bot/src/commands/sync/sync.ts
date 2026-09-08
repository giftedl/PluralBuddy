import { AutoLoad, Command, CommandContext, Declare } from "seyfert";

@Declare({
	name: "sync",
	description: "sync command",
    contexts: ["BotDM", "Guild"]
})
// Being in the same folder with @AutoLoad() you can save this step
@AutoLoad()
export default class SyncCommand extends Command {
	override async run(ctx: CommandContext) {
    }
}