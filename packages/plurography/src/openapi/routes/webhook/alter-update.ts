import { PAlterObject } from "@/pluralbuddy/alter";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerWebhook({
		method: "post",
		path: "alter.update",
		summary: "Receive alter updates",
		description:
			"Receive alter updates via Svix Webhooks built into PluralBuddy.",
		request: {
			body: {
				content: {
					"application/json": {
						schema: z.object({
							userId: z.string(),
							type: z.literal("alter.update"),
							alter: PAlterObject,
						}),
					},
				},
			},
		},
		responses: {},
	});
