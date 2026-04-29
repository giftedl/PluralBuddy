import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "post",
		path: "/auth/oauth2/revoke",
		summary: "Revoke OAuth2 access or refresh token",
		security: [{ bearerAuth: [] }],
		parameters: [],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							client_id: { type: "string", description: "OAuth2 client ID" },
							client_secret: {
								type: "string",
								description: "OAuth2 client secret",
							},
							token: {
								type: "string",
								description: "The token to revoke (access or refresh token)",
							},
							token_type_hint: {
								type: "string",
								enum: ["access_token", "refresh_token"],
								description:
									"Hint about the type of the token submitted for revocation",
							},
						},
						required: ["token"],
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Token revoked successfully. The response body is empty.",
				content: {
					"application/json": {
						schema: { type: "object", description: "Empty object on success" },
					},
				},
			},
			"400": {
				description: "Invalid request or error response",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								error: { type: "string" },
								error_description: { type: "string" },
								error_uri: { type: "string" },
							},
							required: ["error"],
						},
					},
				},
			},
			"401": {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: { message: { type: "string" } },
							required: ["message"],
						},
					},
				},
				description: "Unauthorized. Due to missing or invalid authentication.",
			},
			"403": {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: { message: { type: "string" } },
						},
					},
				},
				description:
					"Forbidden. You do not have permission to access this resource or to perform this action.",
			},
			"404": {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: { message: { type: "string" } },
						},
					},
				},
				description: "Not Found. The requested resource was not found.",
			},
			"429": {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: { message: { type: "string" } },
						},
					},
				},
				description:
					"Too Many Requests. You have exceeded the rate limit. Try again later.",
			},
			"500": {
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: { message: { type: "string" } },
						},
					},
				},
				description:
					"Internal Server Error. This is a problem with the server that you cannot fix.",
			},
		},
	});
