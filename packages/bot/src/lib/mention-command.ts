/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { client } from "..";
import {
	ApplicationCommandOptionType,
	type APIApplicationCommand,
	type APIApplicationCommandSubcommandOption,
} from "seyfert/lib/types";

export let loadedApplicationCommands: (
	| APIApplicationCommand
	| (APIApplicationCommandSubcommandOption & { id: string })
)[] = [];

export async function initializeApplicationCommands() {
	loadedApplicationCommands = (
		await client.proxy.applications(client.applicationId).commands.get()
	).flatMap((c) => [
		c,
		...(
			c.options?.filter(
				(option) => option.type === ApplicationCommandOptionType.Subcommand,
			) ?? []
		).map((subcommand) => {
			return { ...subcommand, id: c.id, name: `${c.name} ${subcommand.name}` };
		}),
	]);
}


export function mentionCommand(
	defaultPrefix: string,
	commandName: string,
	isApplicationCommand: boolean,
    textAdditions?: string
) {
	if (isApplicationCommand)
		return `</${commandName}:${loadedApplicationCommands.find((command) => command.name === commandName)?.id}>`;
	return `\`${defaultPrefix}${commandName} ${textAdditions}\``;
}
