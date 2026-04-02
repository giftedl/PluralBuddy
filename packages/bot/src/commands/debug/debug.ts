import { AutoLoad, Command, Declare, Options } from "seyfert";

@Declare({
	name: "debug",
	description: "Debug options",
    guildId: ["1444187699924963350"],
})
@AutoLoad()
export default class DebugCommand extends Command {
}