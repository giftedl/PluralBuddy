import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { PSystemObject } from "../../pluralbuddy/system";
import { UnauthorizedSchema } from "../utils";

const CreateSystemParams = PSystemObject.omit({
    alterIds: true,
    tagIds: true,
    systemAutoproxy: true,
    createdAt: true,
    associatedUserId: true,
    systemOperationDM: true,
    subAccounts: true,
})
    .partial()
    .and(z.object({ systemName: z.string().max(100).min(1) }));

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "post",
		path: "/v1/users/{user}/system",
		summary: "Create a system",
		description:
			"Create a system. `{user}` can be `@me` to target the current OAuth user. If there is already another system, this will fail.",
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
		request: {
			body: {
				content: {
					"application/json": {
						schema: CreateSystemParams,
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Success.",
				content: {
					"application/json": {
						schema: PSystemObject,
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
		},
	});
