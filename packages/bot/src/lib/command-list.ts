import { ApplicationCommandType } from "seyfert/lib/types";
import { client } from "..";
import { loadedApplicationCommands } from "./mention-command";

const contextDescriptions: Record<string, string> = {
	"Nudge Author": "Nudge the author of a proxied message",
	"Get Message Info": "Get the message info of a proxied message",
	"Delete Message": "Delete a proxied message",
	"Edit Message": "Edit a proxied message",
	"Canary Nudge Author": "Nudge the author of a proxied message",
	"Canary Get Message Info": "Get the message info of a proxied message",
	"Canary Delete Message": "Delete a proxied message",
	"Canary Edit Message": "Edit a proxied message",
};

export function generateCommandList(page: number) {
	return loadedApplicationCommands
		.slice((page - 1) * 65, page * 65)
		.map((c) => {
			return `> - \`${c.type === ApplicationCommandType.ChatInput ? "/" : ""}${c.name}\` – ${c.type === ApplicationCommandType.ChatInput ? c.description : (contextDescriptions[c.name] ?? "")}`;
		})

		.join("\n");
}
