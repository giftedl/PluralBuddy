import { AutoLoad, Command, Declare } from "seyfert";

@Declare({
    name: "autoproxy",
    description: "Set autoproxy settings",
    aliases: ["ap", "proxy"],
    contexts: ["Guild"]
})
@AutoLoad()
export default class AutoProxyCommand extends Command {}