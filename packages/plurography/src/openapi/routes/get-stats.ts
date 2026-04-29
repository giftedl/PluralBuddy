import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "get",
		path: "/v1/stats",
		summary: "Get PluralBuddy statistics",
		security: [],
		description: "Get data of statistical data related to PluralBuddy.",
		responses: {
			"200": {
				description: "Successful.",
				content: {
					"application/json": {
						schema: z.object({
							guildCount: z.number(),
							userCount: z.number(),
							lastDrip: z.number(),
						}),
					},
				},
			},
		},
	});
