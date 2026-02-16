import type {
	ApplicableWebhookEditPayload,
	ApplicableWebhookWritePayload,
} from "@/events/on-message-create";
import { BaseResource, CacheFrom, Webhook, type ReturnCache } from "seyfert";
import type { MakeDeepPartial, SendResolverProps } from "seyfert/lib/common";
import type {
	APIWebhook,
	RESTPostAPIWebhookWithTokenJSONBody,
	RESTPostAPIWebhookWithTokenQuery,
} from "seyfert/lib/types";

type SimilarWebhookObject = {
	webhooks: APIWebhook[];
	lastDrip: Date;
};

export class SimilarWebhookResource extends BaseResource<SimilarWebhookObject> {
	// The namespace is the base that separates each resource
	override namespace = "pb-swebhooks";

	// We override set to apply the typing and format we want
	override set(from: CacheFrom, id: string, webhooks: Webhook[]) {
		return super.set(from, id, {
			webhooks: webhooks.map(
				(c) =>
					({
						id: c.id,
						type: c.type,
						guild_id: c.guildId,
						channel_id: c.channelId,
						user: c.user,
						name: c.name,
						avatar: c.avatar,
						token: c.token,
						application_id: c.applicationId,
						source_guild: c.sourceGuild,
						source_channel: c.sourceChannel,
						url: c.url,
					}) as APIWebhook,
			),
			lastDrip: Date.now(),
		});
	}

	fetch(id: string) {
		const result = super.get(id);

		if (!result?.webhooks) return { webhooks: [], lastDrip: null };

		return {
			...result,
			webhooks: result?.webhooks.map((c) => ({
				...c,
				messages: {
					write: (payload: ApplicableWebhookWritePayload) =>
						this.client.webhooks.writeMessage(c.id, c.token ?? "", payload),
					edit: (payload: ApplicableWebhookEditPayload) =>
						this.client.webhooks.editMessage(c.id, c.token ?? "", payload),
				},
			})),
		};
	}
}
