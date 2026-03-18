/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { decryptExpressToken } from "@/lib/express-token-encryption";
import { getSimilarWebhooks } from "@/lib/proxying/util";
import { applicationsCollection, messagesCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { ContextMenuCommand, Declare, MenuCommandContext, MessageCommandInteraction } from "seyfert";
import { ApplicationCommandType, MessageFlags } from "seyfert/lib/types";

@Declare({
    type: ApplicationCommandType.Message,
    name: `${process.env.BRANCH === "canary" ? "Canary " : ""}Delete Message`,
    contexts: ["BotDM", "Guild"],
})
export default class DeleteMessageContextMenuCommand extends ContextMenuCommand {
    override async run(ctx: MenuCommandContext<MessageCommandInteraction>) {
        await ctx.deferReply(true);
        const messageId = ctx.target.id;
        const message = await messagesCollection.findOneAndDelete({ messageId });

        if (message === null) {
            return await ctx.editResponse({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_OWN_MESSAGE"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })

        }
        if (message?.systemId !== ctx.author.id || (message.guildId ?? undefined) !==( ctx.guildId ?? undefined)) {
            return await ctx.editResponse({
                components: new AlertView(ctx.userTranslations()).errorView("ERROR_OWN_MESSAGE"),
                flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
            })
        }

        if (!message.expressUserId) {
            const channel = await ctx.channel()
            const parent = ("parentId" in channel && channel.isThread()) ? channel.parentId : null;
        
            const similarWebhooks = await getSimilarWebhooks(parent ?? message.channelId);
    
            if (similarWebhooks[0] === undefined) {
                return await ctx.editResponse({
                    components: new AlertView(ctx.userTranslations()).errorView("ERROR_MANUAL_PROXY"),
                    flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
                })
            }
    
            const webhook = similarWebhooks[0]
    
            await webhook.messages.delete({
                messageId,
                query: parent !== null ? { thread_id: channel.id } : {},
                reason: `Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
            });    
        } else {
            const application = await applicationsCollection.findOne({ application: message.expressUserId });

            if (application) {
                const decryptedToken = await decryptExpressToken(application.token.iv, application.token.value)

                console.log(
                await (await fetch(`https://discord.com/api/v10/channels/${ctx.channelId}/messages/${message.messageId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bot ${decryptedToken}`,
                        "X-Audit-Log-Reason": `Removed after user request of @${ctx.author.username} (${ctx.author.id})`
                    }
                })).json())
            }
        }


        return ctx.editResponse({
            components: new AlertView(ctx.userTranslations()).successView("SUCCESSFULLY_REMOVED_MESSAGE"),
            flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral
        })
    }
}