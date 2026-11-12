import { AutoLoad, Command, Declare, IgnoreCommand } from "seyfert";

@Declare({
  name: "autoproxy",
  description: "Set autoproxy settings",
  contexts: ["Guild"],
  ignore: IgnoreCommand.Message,
})
@AutoLoad()
export default class AutoProxyCommand extends Command {}
