import { PTagObject } from "@/pluralbuddy/tag";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerWebhook({
		method: "post",
		path: "tag.update",
		summary: "Receive tag updates",
		description:
			"Receive tag updates via Svix Webhooks built into PluralBuddy.",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							userId: z.string(),
							type: z.literal("tag.update"),
							tag: PTagObject,
						}),
					},
				},
			},
		},
		responses: {},
	});
