/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { runLatchCommand } from "@/lib/ap-cmds/latch";
import { autocompleteAlters } from "@/lib/autocomplete-alters";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import { alterCollection, userCollection } from "@/mongodb";
import type { PAutoProxy } from "@/types/auto-proxy";
import { AlertView } from "@/views/alert";
import {
	type CommandContext,
	createStringOption,
	Declare,
	SubCommand,
	Options,
	User,
	IgnoreCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	"first-alter": createStringOption({
		description: "The alter to latch onto first.",
		autocomplete: autocompleteAlters,
	}),
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
	name: "latch",
	description: "Use latch mode in auto-proxy",
	aliases: ["l", "lch"],
	contexts: ["Guild"],
	ignore: IgnoreCommand.Message,
})
@Options(options)
export default class AlterProxyMode extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		return await runLatchCommand(ctx);
	}
}
