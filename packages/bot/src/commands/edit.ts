/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	Command,
	CommandContext,
	createStringOption,
	Declare,
	Message,
	Options,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { processEditContents } from "@/lib/proxying/process-edit";
import { getSimilarWebhooks } from "@/lib/proxying/util";
import { messagesCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

const options = {
	contents: createStringOption({
		description: "Contents of the new message to edit",
		required: true,
	}),
	msgId: createStringOption({
		description: "Message ID of the message to edit",
		required: false,
		flag: true,
	}),
};

@Declare({
	name: "edit",
	description: "Edits the latest message sent by you",
	aliases: ["e", "modify"],
	contexts: ["Guild"],
})
@Options(options)
export default class EditCommand extends Command {
	override async run(ctx: CommandContext<typeof options>) {
		await ctx.deferReply(true);

		const { contents, msgId } = ctx.options;

		const getMessage = async () => {
			switch (true) {
				case msgId !== undefined:
					return await messagesCollection.findOne(
						{
							systemId: ctx.author.id,
							channelId: ctx.channelId,
							messageId: msgId,
						},
						{ sort: { createdAt: -1 } },
					);
				case (ctx.message as Message | undefined) !== undefined &&
					(ctx.message as unknown as Message).referencedMessage !== undefined:
					return await messagesCollection.findOne({
						messageId: (ctx.message as unknown as Message).referencedMessage
							?.id,
					});
				default:
					return await messagesCollection.findOne(
						{ systemId: ctx.author.id, channelId: ctx.channelId },
						{ sort: { createdAt: -1 } },
					);
			}
		};
		let message = await getMessage()

		if (message === null) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"NOT_RECENT_ENOUGH",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		if (
			message?.systemId !== ctx.author.id ||
			message.guildId !== ctx.guildId
		) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_OWN_MESSAGE",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const fetchedMessage = await ctx.client.messages.fetch(
			message.messageId,
			message.channelId,
			true,
		);
		const channel = await fetchedMessage.channel();
		const parent =
			"parentId" in channel && channel.isThread() ? channel.parentId : null;

		const similarWebhooks = await getSimilarWebhooks(parent ?? channel.id);
		if (similarWebhooks[0] === undefined) {
			return await ctx.editResponse({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_MANUAL_PROXY",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const webhook = similarWebhooks[0];
		const guild = await ctx.retrievePGuild();
		const member = ctx.member;

		if (!member) throw new Error("no member.");

		await processEditContents(
			message,
			fetchedMessage,
			webhook,
			contents,
			guild,
			member,
		);

		return ctx.deleteResponse().then(() => {
			if ((ctx.message as unknown) instanceof Message) {
				const message = ctx.message as unknown as Message;

				message.delete(
					`Removed after user request of @${ctx.author.username} (${ctx.author.id})`,
				);
			}
		});
	}
}
