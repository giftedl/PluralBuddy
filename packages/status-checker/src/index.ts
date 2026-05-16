import type { RESTPostAPIWebhookWithTokenJSONBody } from "discord-api-types/v9";
import type { ClientType } from "bot";
import { hc } from "hono/client";

const statusUrl = "https://internal-pb.giftedly.dev/api/stats"

export const { api } = hc<ClientType>(statusUrl, {
	headers: {
		"X-PluralBuddy-Api-Key": process.env.BACKEND_TOKEN ?? ".",
	},
});

async function executeWebhook(body: RESTPostAPIWebhookWithTokenJSONBody) {
    return await fetch(process.env.URGENT_WEBHOOK ?? "", {
        method: "POST",
        body: JSON.stringify(body)
    })
}

async function executeStatusEndpoint() {
    return await api.health.$get()
}