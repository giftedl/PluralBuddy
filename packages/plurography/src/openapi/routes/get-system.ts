import { PSystemObject } from "@/pluralbuddy/system";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UnmatchedOAuthSchema, UnauthorizedSchema } from "@/openapi/utils"
import z from "zod";

export const register = (registry: OpenAPIRegistry) => registry.registerPath({
	method: "get",
	path: "/v1/users/{user}/system",
	summary: "Get PluralBuddy system",
	description:
		"Get data of a PluralBuddy system. `{user}` can be `@me` to target the current OAuth user.",
	security: [{ oAuth2: ["system:read"] }],
	responses: {
		"200": {
			description: "Success response. Response with the message.",
			content: {
				"application/json": {
					schema: z.object({
						data: PSystemObject,
					}),
				},
			},
		},
		"400": {
			description: "@me is the only allowed user for this endpoint.",
			content: {
				"application/json": {
					schema: UnmatchedOAuthSchema,
				},
			},
		},
		"401": {
			description: "Not properly authenticated.",
			content: {
				"application/json": {
					schema: UnauthorizedSchema,
				},
			},
		},
	},
});