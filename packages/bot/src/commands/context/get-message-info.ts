/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { alterCollection, messagesCollection, userCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";
import { MessageInfo } from "@/views/message-info";
import type { MenuCommandContext, MessageCommandInteraction } from "seyfert";
import { Declare, Message } from "seyfert";
import { ContextMenuCommand } from "seyfert";
import { ApplicationCommandType, MessageFlags } from "seyfert/lib/types";

@Declare({
	type: ApplicationCommandType.Message,
	name: "Get Message Info",
	contexts: ["BotDM", "Guild"],
})
export default class GetMessageInfoCommand extends ContextMenuCommand {
	override async run(ctx: MenuCommandContext<MessageCommandInteraction>) {
		const messageId = ctx.target.id;
		const message = await messagesCollection.findOne({ messageId });

		if (message === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"MESSAGE_NOT_MINE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const user = await userCollection.findOne({ userId: message.systemId });
		const alter = await alterCollection.findOne({ alterId: message.alterId });

		if (user === null || user.system === undefined || alter === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"DATA_DOESNT_EXIST",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		return await ctx.write({
			components: await new MessageInfo(ctx.userTranslations()).messageInfo(message, alter, user.system, ctx.target, await (await ctx.guild())?.members.fetch(user.userId, true)!, alter.systemId !== ctx.author.id),
			flags: MessageFlags.Ephemeral + MessageFlags.IsComponentsV2
		});
	}
}
