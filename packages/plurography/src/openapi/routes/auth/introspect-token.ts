import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		summary: "Introspect an OAuth2 access or refresh token",
		security: [{ bearerAuth: [] }],
		path: "/auth/oauth2/introspect",
		method: "post",
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
								description:
									"The token to introspect (access or refresh token)",
							},
							token_type_hint: {
								type: "string",
								enum: ["access_token", "refresh_token"],
								description:
									"Hint about the type of the token submitted for introspection",
							},
							resource: {
								type: "string",
								description: "Introspects a token for a specific resource.",
							},
						},
						required: ["token"],
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Token introspection response",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								active: {
									type: "boolean",
									description: "Whether the token is active",
								},
								scope: {
									type: "string",
									description: "Scopes associated with the token",
								},
								client_id: {
									type: "string",
									description: "Client ID associated with the token",
								},
								username: {
									type: "string",
									description: "Username associated with the token",
								},
								token_type: {
									type: "string",
									description: "Type of the token",
								},
								exp: {
									type: "number",
									description:
										"Expiration time of the token (seconds since epoch)",
								},
								iat: {
									type: "number",
									description: "Issued at time (seconds since epoch)",
								},
								nbf: {
									type: "number",
									description: "Not before time (seconds since epoch)",
								},
								sub: { type: "string", description: "Subject of the token" },
								aud: { type: "string", description: "Audience of the token" },
								iss: { type: "string", description: "Issuer of the token" },
								jti: { type: "string", description: "JWT ID" },
							},
							required: ["active"],
						},
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
