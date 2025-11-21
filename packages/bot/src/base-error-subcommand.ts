/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	Command,
	SubCommand,
	type CommandContext,
	type OnOptionsReturnObject,
} from "seyfert";
import { AlertView } from "./views/alert";
import { MessageFlags } from "seyfert/lib/types";
import { posthogClient } from ".";
import { DiscordSnowflake } from "@sapphire/snowflake";

export abstract class BaseErrorSubCommand extends SubCommand {
	override async onOptionsError(
		context: CommandContext,
		metadata: OnOptionsReturnObject,
	) {
		if (context.author.bot === true) return;

		const errors = Object.entries(metadata)
			.filter((_) => _[1].failed)
			.map((error) => `${error[0]}: ${error[1].value}`)
			.join("\n");

		await context.editOrReply({
			components: [
				...new AlertView(context.userTranslations()).errorViewCustom(
					context
						.userTranslations()
						.PLURALBUDDY_OPTIONS_ERROR.replace("%options_errors%", errors),
				),
			],
			flags: MessageFlags.IsComponentsV2,
		});
	}

	override async onRunError(context: CommandContext, error: unknown) {
		context.client.logger.fatal(error);

		const interactionId = (
			context.interaction ?? { id: `c${DiscordSnowflake.generate()}` }
		).id

		if (posthogClient)
			posthogClient.captureException(error, context.author.id, {
				$set: { username: context.author.username },

				interactionId,
				guildId: context.guildId,
				channelId: context.channelId,
			});

		await context.editOrReply({
			components: [
				// @ts-ignore
				...new AlertView(null).errorViewCustom(
					`There was an error while doing that action.\n-# Interaction: \`${interactionId}\``,
				),
			],
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
