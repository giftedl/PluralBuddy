/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getSimilarWebhooks } from "@/lib/proxying/util";
import { messagesCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { ContextMenuCommand, Declare, MenuCommandContext, MessageCommandInteraction } from "seyfert";
import { ApplicationCommandType, MessageFlags } from "seyfert/lib/types";

@Declare({
    type: ApplicationCommandType.Message,
    name: "Delete Message",
    contexts: ["BotDM", "Guild"]
})
export default class DeleteMessageContextMenuCommand extends ContextMenuCommand {
    override async run(ctx: MenuCommandContext<MessageCommandInteraction>) {
        const messageId = ctx.target.id;
        const message = await messagesCollection.findOneAndDelete({ messageId });

        if (message === null) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_OWN_MESSAGE"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })

        }

        if (message?.systemId !== ctx.author.id || message.guildId !== ctx.guildId) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_OWN_MESSAGE"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

		const similarWebhooks = await getSimilarWebhooks(message.channelId);

        if (similarWebhooks[0] === undefined) {
            return await ctx.write({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_MANUAL_PROXY"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

        const webhook = similarWebhooks[0]

        await webhook.messages.delete(messageId, `Removed after user request of @${ctx.author.username} (${ctx.author.id})`)

        return ctx.write({
            components: new AlertView(ctx.userTranslations()).successView("SUCCESSFULLY_REMOVED_MESSAGE"),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
    }
}