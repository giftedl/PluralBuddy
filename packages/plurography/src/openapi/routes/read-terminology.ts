import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { PTerminology } from "../../pluralbuddy/terminology";
import { UnauthorizedSchema } from "../utils";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "get",
		path: "/v1/users/{user}/terminology",
		summary: "Get a user's terminology",
		description:
			"Get specific data about a user's terminology. `{user}` can be `@me` to target the current OAuth user.",
		security: [{ oAuth2: ["system:read"] }],
		parameters: [
			{
				name: "user",
				in: "path",
				required: true,
				description:
					"`{user}` is a Discord user Snowflake, or `@me`, referencing the current OAuth user.",
				schema: {
					type: "string",
				},
			},
		],
		responses: {
			"200": {
				description: "Success.",
				content: {
					"application/json": {
						schema: PTerminology.nonoptional(),
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
