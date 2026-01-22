/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { emojis } from "@/lib/emojis";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { alterCollection, messagesCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import type { MenuCommandContext } from "seyfert";
import {
	ActionRow,
	Button,
	ContextMenuCommand,
	Declare,
	MessageCommandInteraction,
} from "seyfert";
import {
	ApplicationCommandType,
	ButtonStyle,
	MessageFlags,
} from "seyfert/lib/types";

@Declare({
	type: ApplicationCommandType.Message,
	name: "Nudge Author",
	contexts: ["BotDM", "Guild"],
})
export default class DeleteMessageContextMenuCommand extends ContextMenuCommand {
	override async run(ctx: MenuCommandContext<MessageCommandInteraction>) {
		const messageId = ctx.target.id;
		const message = await messagesCollection.findOne({ messageId });
		const guild = await ctx.retrievePGuild()

        if (guild.getFeatures().disabledNudging) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("FEATURE_DISABLED_GUILD"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

		if (message === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_OWN_MESSAGE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}
		const user = await userCollection.findOne({ userId: message.systemId });

		if (
			!user?.nudging.currentlyEnabled ||
			user.nudging.blockedUsers.includes(ctx.author.id)
		) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"USER_CANNOT_BE_NUDGED",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const alter = await alterCollection.findOne({ alterId: message.alterId });

		if (
			(
				alter?.nameMap.find((c) => c.server === ctx.guildId)?.name ??
				alter?.displayName
			)?.includes("@everyone")
		) {
			return await ctx.write({
				content:
					"The alter name has @everyone in it, so this user cannot be nudged.",
				flags: MessageFlags.Ephemeral,
			});
		}

		return await ctx.write({
			content: `-# || \`${ctx.author.id} → ${alter?.systemId}/${alter?.alterId}\` ||\n${emojis.reply} Hey, <@${message.systemId}> (${alter?.nameMap.find((c) => c.server === ctx.guildId)?.name ?? alter?.displayName})! Wake up!\n> ${emojis.lineRight} Nudged by @${ctx.author.name}`,
			components: [
				new ActionRow().setComponents(
					new Button()
						.setCustomId(InteractionIdentifier.Nudge.Snooze.create())
						.setLabel(ctx.userTranslations().NUDGE_SNOOZE)
						.setStyle(ButtonStyle.Primary)
						.setEmoji(emojis.xWhite),
					new Button()
						.setCustomId(
							InteractionIdentifier.Nudge.BlockUser.create(ctx.author.id),
						)
						.setLabel(ctx.userTranslations().BLOCK_SNOOZE)
						.setStyle(ButtonStyle.Secondary),
				),
			],
		});
	}
}
