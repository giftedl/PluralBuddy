import { createInvite } from "@/actions/invite";
import { Command, type CommandContext, createStringOption, Declare, IgnoreCommand, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
    action: createStringOption({
        required: true,
        description: "What action to execute",
        choices: [
            { name: "Invite creation util", value: "invite" }
        ]
    })
}

@Declare({
    name: 'action',
    description: "Execute an action to run",
    contexts: ["Guild"],
    guildId: ["1444187699924963350"],
    ignore: IgnoreCommand.Message
})
@Options(options)
export default class ServerSpecificActions extends Command {
    override async run(context: CommandContext<typeof options>) {
        let result = null;

        if (context.options.action === "invite") {
            result = await createInvite(context);
        }

        return await context.write({
            content: result ?? "null",
            flags: MessageFlags.Ephemeral
        })
    }
}