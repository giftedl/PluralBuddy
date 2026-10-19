import { runCustomProviderCommand } from "@/lib/ap-cmds/custom";
import { sendAutoproxyOperationDM } from "@/lib/autoproxy-operation";
import { getOAuthConsents } from "@/lib/oauth";
import { userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import type { PAutoProxy } from "plurography";
import {
	type CommandContext,
	Container,
	createStringOption,
	Declare,
	IgnoreCommand,
	Options,
	SubCommand,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	provider: createStringOption({
		description: "Integration used as auto-proxy mode.",
		required: true,
		autocomplete: async (ctx) => {
			const oauthConsents = await getOAuthConsents(ctx.user.id);
			const focus = ctx.getInput();

			return ctx.respond(
				oauthConsents
					.filter(
						(ch) =>
							(ch.metadata?.aaid ?? "").includes(focus) ||
							ch.name?.includes(focus) ||
							ch.clientId === focus,
					)
					.map((ch) => ({
						name: `${ch.name} - ${ch.metadata?.aaid} (AI/AP ID)`,
						value: ch.clientId,
					})),
			);
		},
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
	name: "custom",
	description: "Use a custom, integration auto-proxy mode.",
	contexts: ["Guild"],
	ignore: IgnoreCommand.Message,
})
@Options(options)
export default class CustomProxyMode extends SubCommand {
	override async run(ctx: CommandContext<typeof options>) {
		return await runCustomProviderCommand(ctx);
	}
}
