import { runStatusCommand } from "@/lib/ap-cmds/status";
import { alterCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { AlterView } from "@/views/alters";
import {
	type CommandContext,
	Container,
	createStringOption,
	Declare,
	IgnoreCommand,
	Options,
	Separator,
	SubCommand,
	TextDisplay,
} from "seyfert";
import type { ColorResolvable } from "seyfert/lib/common";
import { MessageFlags } from "seyfert/lib/types";

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
	ignore: IgnoreCommand.Message,
})
@Options(options)
export default class StatusAutoProxy extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		return await runStatusCommand(ctx, false);
	}
}
