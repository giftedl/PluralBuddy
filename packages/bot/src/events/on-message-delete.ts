import { messagesCollection } from "@/mongodb";
import { createEvent, Message } from "seyfert";
import { client } from "..";
import { getSimilarWebhooks } from "@/lib/proxying/util";

export default createEvent({
	data: { name: "messageDelete", once: false },
	run: async (message) => {
		const referencedMessages = await messagesCollection
			.find({
				referencedMessage: message.id,
			})
			.toArray();

		const channel = await client.channels.fetch(message.channelId)
		const parent = ("parentId" in channel && channel.isThread()) ? channel.parentId : null;

		const similarWebhooks = await getSimilarWebhooks(parent ?? channel.id);

		if (similarWebhooks[0] === undefined) {
			return;
		}

		const webhook = similarWebhooks[0];

		for (const message of referencedMessages) {
			try {
				const nativeMessage = await client.messages.fetch(
					message.messageId,
					message.channelId,
				);

				webhook.messages.edit({
					messageId: nativeMessage.id,
					body: {
                        // @ts-ignore
						components: nativeMessage.components.slice(1),
					},
					query: parent !== null ? { thread_id: channel.id } : {}
				});
			} catch (_) {}
		}
	},
});
