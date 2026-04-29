import { PTagObject } from "@/pluralbuddy/tag";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { UnauthorizedSchema } from "../utils";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "get",
		path: "/v1/users/{user}/system/list-tags",
		summary: "List system tags",
		description:
			"List data about tags in a system. `{user}` can be `@me` to target the current OAuth user. This endpoint **does** allow for external system tag data (if achievable in conjunction with the system's privacy settings and the logged in OAuth user).",
		security: [{ oAuth2: ["alters:read"] }],
		parameters: [
			{
				description:
					"How many entries to show at most if in a pagination. Can only be at most 30 alters.",
				name: "max",
				in: "query",
                schema: { type: "number", maximum: 30 }
			},
			{
				description: "How many entries to skip if in a pagination.",
				name: "skip",
				in: "query",
                schema: { type: "number" }
			},
		],
		responses: {
			"200": {
				description: "Success.",
				content: {
					"application/json": {
						schema: PTagObject.array(),
					},
				},
			},
			"400": {
				description:
					"You can only show at most 30 alters in a current pagination or you aren't using the current OAuth user.",
				content: {
					"application/json": {
						schema: z.object({
							errors: z.array(
								z.object({
									type: z.enum(["not-matching-oauth", "max-too-high"]),
									friendly: z.string(),
								}),
							),
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
