/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { processEditContents } from "@/lib/proxying/process-edit";
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
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";

const options = {
	contents: createStringOption({
		description: "Contents of the new message to edit",
		required: true,
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
		const message =
			(ctx.message as Message | undefined) === undefined ||
			(ctx.message as unknown as Message).referencedMessage === undefined
				? await messagesCollection.findOne(
						{ systemId: ctx.author.id, channelId: ctx.channelId },
						{ sort: { createdAt: -1 } },
					)
				: await messagesCollection.findOne({
						messageId: (ctx.message as unknown as Message).referencedMessage
							?.id,
					});
		const { contents } = ctx.options;

		if (message === null) {
			return await ctx.write({
				components: new AlertView(ctx.userTranslations()).errorView(
					"NOT_RECENT_ENOUGH",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

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
		const fetchedMessage = await ctx.client.messages.fetch(
			message.messageId,
			message.channelId,
			true,
		);
		const guild = await ctx.retrievePGuild();
		const member = ctx.member;

		if (!member) throw new Error("no member.")

		await processEditContents(message, fetchedMessage, webhook, contents, guild, member);

		return ctx
			.write({
				components: new AlertView(ctx.userTranslations()).successViewCustom(
					ctx
						.userTranslations()
						.SUCCESSFULLY_EDITED_MESSAGE.replace(
							"%message%",
							`https://discord.com/channels/${ctx.guildId}/${fetchedMessage?.channelId}/${fetchedMessage?.id}`,
						),
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
				setTimeout(() => ctx.deleteResponse(), 2500);
			});
	}
}
