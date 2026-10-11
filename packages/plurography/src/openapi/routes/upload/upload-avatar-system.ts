import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { PSystemObject } from "../../../pluralbuddy/system";
import { UnauthorizedSchema } from "../../utils";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "post",
		path: "/v1/users/{user}/system/upload-avatar",
		summary: "Upload system avatar",
		description:
			"**You must provide an image in the body.** Upload system avatar, maximum file size is 1MB. `{user}` can be `@me` to target the current OAuth user.",
		security: [{ oAuth2: ["system:write"] }],
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
									type: z.enum(["not-matching-oauth", "zod", "file-too-big"]),
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
