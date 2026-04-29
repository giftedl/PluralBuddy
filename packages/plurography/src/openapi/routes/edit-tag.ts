import { PTagObject } from "@/pluralbuddy/tag";
import { UnauthorizedSchema } from "../utils";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";

export const register = (registry: OpenAPIRegistry) => registry.registerPath({
	method: "post",
	path: "/v1/users/{user}/tags/{tag}/edit",
	summary: "Edit a system tag",
	description:
		"Edit a system tag by its ID. `{user}` can be `@me` to target the current OAuth user.",
	security: [{ oAuth2: ["tags:write"] }],
	request: {
		body: {
			content: {
				"application/json": {
					schema: PTagObject.omit({
						tagId: true,
						systemId: true,
						associatedAlters: true,
					})
						.partial()
						.default({}),
				},
			},
		},
	},
	responses: {
		"200": {
			description: "Success.",
			content: {
				"application/json": {
					schema: PTagObject,
				},
			},
		},
		"400": {
			description: "Client error while processing input.",
			content: {
				"application/json": {
					schema: z.object({
						errors: z.array(
							z.object({
								type: z.enum(["not-matching-oauth", "zod"]),
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
		"404": {
			description: "Couldn't find the tag",
			content: {
				"application/json": {
					schema: z.object({
						type: z.literal("unknown-tag"),
						friendly: z.literal("Couldn't find this tag."),
					}),
				},
			},
		},
	},
});