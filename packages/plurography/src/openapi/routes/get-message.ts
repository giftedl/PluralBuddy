import { PMessageObject } from "@/pluralbuddy/message";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { UnauthorizedSchema } from "../utils";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "get",
		path: "/v1/messages/{id}",
		summary: "Get PluralBuddy message",
		description: "Get a PluralBuddy message by Message ID",
		security: [{ oAuth2: [] }],
		responses: {
			"200": {
				description: "Success response. Response with the message.",
				content: {
					"application/json": {
						schema: z.object({
							message: PMessageObject.extend({
								endpoints: z.object({
									system: z.string().meta({
										examples: ["api/v1/users/1481859816656736257/system"],
									}),
								}),
							}),
						}),
					},
				},
			},
			"401": {
				description: "No access token when authenticating.",
				content: {
					"application/json": {
						schema: UnauthorizedSchema,
					},
				},
			},
		},
	});
