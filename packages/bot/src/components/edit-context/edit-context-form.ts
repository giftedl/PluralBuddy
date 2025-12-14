import {
	ComponentCommand,
	ModalCommand,
	ModalContext,
	type ComponentContext,
} from "seyfert";
import { InteractionIdentifier } from "@/lib/interaction-ids";
import { AlertView } from "@/views/alert";
import { messagesCollection } from "@/mongodb";
import { MessageFlags } from "seyfert/lib/types";
import { getSimilarWebhooks } from "@/lib/proxying/util";
import { processEditContents } from "@/lib/proxying/process-edit";

export default class EditContextForm extends ModalCommand {
	componentType = "Button" as const;

	override filter(context: ModalContext) {
		return InteractionIdentifier.EditMenu.EditContextForm.startsWith(
			context.customId,
		);
	}

	override async run(ctx: ModalContext) {
        const messageId = InteractionIdentifier.EditMenu.EditContextForm.substring(ctx.customId)[0];
        const contents = ctx.interaction.getInputValue(InteractionIdentifier.EditMenu.EditContextType.create(), true);
		const message = await messagesCollection.findOne(
			{ messageId },
		);

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
		const fetchedMessage = await ctx.client.messages.fetch(message.messageId, message.channelId, true);

		await processEditContents(message, fetchedMessage, webhook, contents as string)

		return ctx.write({
			components: new AlertView(ctx.userTranslations()).successViewCustom(
				ctx.userTranslations().SUCCESSFULLY_EDITED_MESSAGE.replace("%message%", `https://discord.com/channels/${ctx.guildId}/${fetchedMessage?.channelId}/${fetchedMessage?.id}`),
			),
			flags: MessageFlags.IsComponentsV2 + MessageFlags.Ephemeral,
		});
    }
}
