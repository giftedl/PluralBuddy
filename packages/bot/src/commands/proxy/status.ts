import { runStatusCommand } from "@/lib/ap-cmds/status";
import { type CommandContext, createStringOption, Declare, Options, SubCommand } from "seyfert";

const options = {
  scope: createStringOption({
    description: "Where to use this auto-proxy mode.",
    choices: [
      { name: "Globally", value: "global" },
      { name: "Server-wide", value: "server" },
      { name: "Channel-wide", value: "channels" },
    ],
  }),
};

@Declare({
  name: "status",
  description: "Get the status of the current auto-proxy",
  aliases: ["s"],
  contexts: ["Guild"],
})
@Options(options)
export default class StatusAutoProxy extends SubCommand {
  override async run(ctx: CommandContext<typeof options>) {
    return await runStatusCommand(ctx, false);
  }
}
