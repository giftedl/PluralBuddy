import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { PAlterObject } from "../../pluralbuddy/alter";
import { PTagObject, tagColors } from "../../pluralbuddy/tag";
import { UnauthorizedSchema } from "../utils";

const CreateTagParams = PTagObject.omit({
	tagId: true,
	tagFriendlyName: true,
	tagColor: true,
	systemId: true,
	associatedAlters: true,
	fields: true
}).optional().and(z.object({
	color: z.enum(tagColors),
	displayName: z.string().max(100).min(3),
}));

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "post",
		path: "/v1/users/{user}/system/create-tag",
		summary: "Create a system tag",
		description:
			"Create a system tag. `{user}` can be `@me` to target the current OAuth user.",
		security: [{ oAuth2: ["tags:write"] }],
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
		request: {
			body: {
				content: {
					"application/json": {
						schema: CreateTagParams,
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
									type: z.enum(["not-matching-oauth", "zod", "too-many-tags"]),
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
				description: "Couldn't find the alter",
				content: {
					"application/json": {
						schema: z.object({
							type: z.literal("unknown-alter"),
							friendly: z.literal("Couldn't find this alter."),
						}),
					},
				},
			},
		},
	});
