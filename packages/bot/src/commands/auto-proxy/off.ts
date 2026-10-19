/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	type CommandContext,
	createStringOption,
	Declare,
	IgnoreCommand,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { Shortcut } from "yunaforseyfert";
import { runOffCommand } from "@/lib/ap-cmds/off";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import { userCollection } from "@/mongodb";
import type { PAutoProxy } from "@/types/auto-proxy";
import { AlertView } from "@/views/alert";

const options = {
	scope: createStringOption({
		description: "Where to use this auto-proxy mode. Default server-wide.",
		choices: [
			{ name: "Globally", value: "global" },
			{ name: "Server-wide", value: "server" },
			{ name: "Channel-wide", value: "channels" },
		],
	}),
};

@Declare({
	name: "off",
	description: "Disable auto-proxy",
	contexts: ["Guild", "BotDM"],
	aliases: ["shutup"],
	ignore: IgnoreCommand.Message,
})
@Options(options)
export default class OffAutoProxy extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		return await runOffCommand(ctx);
	}
}
