/**  * PluralBuddy Discord Bot  *  - is licensed under Apache License 2.0.  */

import {
  type APIApplicationCommand,
  type APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
} from "seyfert/lib/types";
import cachedCommands from "@/../commands.json";
import { client } from "..";

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
        (option) =>
          option.type === ApplicationCommandOptionType.Subcommand ||
          option.type === ApplicationCommandOptionType.SubcommandGroup,
      ) ?? []
    ).flatMap((subcommand) => {
      if (subcommand.type === ApplicationCommandOptionType.SubcommandGroup) {
        return (
          subcommand.options?.filter(
            (option) => option.type === ApplicationCommandOptionType.Subcommand,
          ) ?? []
        ).map((subsubcommand) => {
          return {
            ...subsubcommand,
            id: c.id,
            name: `${c.name} ${subcommand.name} ${subsubcommand.name}`,
          };
        });
      }

      return { ...subcommand, id: c.id, name: `${c.name} ${subcommand.name}` };
    }),
  ]);
}

export function mentionCommand(
  defaultPrefix: string,
  commandName: string,
  isApplicationCommand: boolean,
  textAdditions?: string,
) {
  if (isApplicationCommand)
    return `</${commandName}:${loadedApplicationCommands.find((command) => command.name === commandName)?.id}>`;
  return `\`${defaultPrefix}${commandName}${textAdditions !== undefined ? ` ${textAdditions}` : ""}\``;
}
