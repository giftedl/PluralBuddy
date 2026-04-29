
import { PSystemObject } from "@/pluralbuddy/system";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { UnmatchedOAuthSchema, UnauthorizedSchema } from "@/openapi/utils"
import z from "zod";
import { PTagObject } from "@/pluralbuddy/tag";

export const register = (registry: OpenAPIRegistry) => registry.registerPath({
	method: "get",
	path: "/v1/users/{user}/tags/{tag}",
	summary: "Get a system tag",
	description:
		"Get data about a specific tag by ID. `{user}` can be `@me` to target the current OAuth user. This endpoint **does** allow for external system tag data (if achievable in conjunction with the system's privacy settings and the logged in OAuth user).",
	security: [{ oAuth2: ["tags:read"] }],
	responses: {
		"200": {
			description: "Success.",
			content: {
				"application/json": {
					schema: z.object({
						isSelf: z.boolean(),
						data: PTagObject.nullable(),
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