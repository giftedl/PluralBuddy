import { PSystemObject } from "@/pluralbuddy/system";
import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { UnauthorizedSchema } from "../utils";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "post",
		path: "/v1/users/{user}/system/edit",
		summary: "Edit system data",
		description:
			"Edit system data. `{user}` can be `@me` to target the current OAuth user.",
		security: [{ oAuth2: ["system:write"] }],
		request: {
			body: {
				content: {
					"application/json": {
						schema: PSystemObject.omit({
							alterIds: true,
							tagIds: true,
							systemAutoproxy: true,
							createdAt: true,
							associatedUserId: true,
							systemOperationDM: true,
							subAccounts: true,
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
				description: "Couldn't find the system",
				content: {
					"application/json": {
						schema: z.object({
							type: z.literal("no-system"),
							friendly: z.literal("This user does not have a system."),
						}),
					},
				},
			},
		},
	});
