import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { PAlterObject } from "../../pluralbuddy/alter";
import { UnauthorizedSchema } from "../utils";

const CreateAlterParams = PAlterObject.omit({
	alterId: true,
	systemId: true,
	lastMessageTimestamp: true,
	created: true,
	fields: true,
	messageCount: true,
	tagIds: true,
	proxyTags: true,
})
	.partial()
	.and(
		z.object({
			username: z
				.string()
				.max(100)
				.regex(/^[^\s@\\/]+$/),
			displayName: z.string().max(100),
			proxyTags: z
				.object({
					prefix: z.string().max(100),
					suffix: z.string().max(100),
				})
				.array()
				.default([])
				.optional(),
		}),
	);
	
export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "post",
		path: "/v1/users/{user}/system/create-alter",
		summary: "Create a system alter",
		description:
			"Create a system alter. `{user}` can be `@me` to target the current OAuth user. Username must be unique.",
		security: [{ oAuth2: ["alters:write"] }],
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
						schema: CreateAlterParams,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Success.",
				content: {
					"application/json": {
						schema: PAlterObject,
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
									type: z.enum([
										"not-matching-oauth",
										"zod",
										"too-many-alters",
										"duplicate",
									]),
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
