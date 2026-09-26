import {
	ComponentCommand,
	type ComponentContext,
	ModalCommand,
	ModalContext,
} from "seyfert";
import { MessageFlags } from "seyfert/lib/types";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { processEditContents } from "@/lib/proxying/process-edit";
import { getSimilarWebhooks } from "@/lib/proxying/util";
import { messagesCollection } from "@/mongodb";
import { AlertView } from "@/views/alert";

export default class EditContextForm extends ModalCommand {
	componentType = "Button" as const;

	override filter(context: ModalContext) {
		return InteractionIdentifier.EditMenu.EditContextForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
		const messageId = InteractionIdentifier.EditMenu.EditContextForm.substring(
			ctx.customId,
		)[0];
		const contents = ctx.interaction.getInputValue(
			InteractionIdentifier.EditMenu.EditContextType.create(),
			true,
		);
		const message = await messagesCollection.findOne({ messageId });
		const guild = await ctx.retrievePGuild();

		if (message === null) {
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"NOT_RECENT_ENOUGH",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		if (
			message?.systemId !== ctx.author.id
		) {
			return await ctx.write({
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
			return await ctx.write({
				components: new AlertView(await ctx.userTranslations()).errorView(
					"ERROR_MANUAL_PROXY",
				),
				flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
			});
		}

		const webhook = similarWebhooks[0];
		const member = ctx.member ?? await ctx.client.members.fetch(message.guildId ?? "", ctx.author.id, false)

		if (!member) throw new Error("No member object.");

		await processEditContents(
			message,
			fetchedMessage,
			webhook,
			contents as string,
			guild,
			member,
		);

		return ctx.write({
			components: new AlertView(await ctx.userTranslations()).successViewCustom(
				(await ctx.userTranslations()).SUCCESSFULLY_EDITED_MESSAGE.replace(
					"%message%",
					`https://discord.com/channels/${message.guildId ?? fetchedMessage.guildId}/${fetchedMessage?.channelId}/${fetchedMessage?.id}`,
				),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
	}
}
