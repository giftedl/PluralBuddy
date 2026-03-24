/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { getSimilarWebhooks } from "@/lib/proxying/util";
import { messagesCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import {
	Command,
	CommandContext,
	createStringOption,
	Declare,
	Message,
	Options,
	Webhook,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { client } from "..";

@Declare({
	name: "delete",
	description: "Deletes the latest message sent by you",
	aliases: ["d", "purge"],
	contexts: ["Guild"],
})
export default class DeleteCommand extends Command {
	override async run(ctx: CommandContext) {
		await ctx.deferReply(true);
		const referencedMessageId = (ctx.message as Message | undefined)
			?.referencedMessage?.id;
		const message = await messagesCollection.findOneAndDelete(
			{
				systemId: ctx.author.id,
				channelId: ctx.channelId,
				...(referencedMessageId ? { messageId: referencedMessageId } : {}),
			},
			{ sort: { createdAt: -1 } },
		);

		if (message === null) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
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
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_OWN_MESSAGE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}
		const channel = await ctx.channel();
		const parent =
			"parentId" in channel && channel.isThread() ? channel.parentId : null;

		const similarWebhooks = await getSimilarWebhooks(
			parent ?? message.channelId,
		);

		if (similarWebhooks[0] === undefined) {
			return await ctx.editResponse({
				components: new AlertView((await ctx.userTranslations())).errorView(
					"ERROR_MANUAL_PROXY",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const webhook = similarWebhooks[0];

		await webhook.messages.delete({
			messageId,
			query: parent !== null ? { thread_id: channel.id } : {},
			reason: `Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
		});

		return ctx
			.editResponse({
				components: new AlertView((await ctx.userTranslations())).successView(
					"SUCCESSFULLY_REMOVED_MESSAGE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			})
			.then(() => {
				if ((ctx.message as unknown) instanceof Message) {
					const message = ctx.message as unknown as Message;

					message.delete(
						`Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
					);
				}
				setTimeout(() => ctx.deleteResponse(), 1000);
			});
	}
}
