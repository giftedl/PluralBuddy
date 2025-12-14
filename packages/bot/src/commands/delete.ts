/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getSimilarWebhooks } from "@/lib/proxying/util";
import { messagesCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { Command, CommandContext, Declare, Message, Options } from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

@Declare({
	name: "delete",
	description: "Deletes the latest message sent by you",
	aliases: ["d", "purge"],
	contexts: ["Guild"],
})
export default class DeleteCommand extends Command {
	override async run(ctx: CommandContext) {
		const message = 
			await messagesCollection
				.findOneAndDelete({ systemId: ctx.author.id, channelId: ctx.channelId }, { sort: { createdAt: -1 } });
        
        if (message === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"NOT_RECENT_ENOUGH",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
        }
        
        const { messageId } = message;

		if (
			message?.systemId !== ctx.author.id ||
			message.guildId !== ctx.guildId
		) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_OWN_MESSAGE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const similarWebhooks = await getSimilarWebhooks(message.channelId);

		if (similarWebhooks[0] === undefined) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"ERROR_MANUAL_PROXY",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const webhook = similarWebhooks[0];

		await webhook.messages.delete(
			messageId,
			`Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
		);

		return ctx.write({
			components: new AlertView(ctx.userTranslations()).successView(
				"SUCCESSFULLY_REMOVED_MESSAGE",
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		}).then(() => {
            if (ctx.message as unknown instanceof Message) {
                const message = ctx.message as unknown as Message;

                message.delete(`Removed after user request of @${ctx.author.username} (${ctx.author.id})`)
            }
            setTimeout(() => ctx.deleteResponse(), 1000)
        });
	}
}
