import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "post",
		path: "/auth/oauth2/token",
		summary: "Obtain an OAuth2.1 access token",
		security: [{ bearerAuth: [] }],
		parameters: [],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							grant_type: {
								type: "string",
								enum: [
									"authorization_code",
									"client_credentials",
									"refresh_token",
								],
								description: "OAuth2 grant type",
							},
							client_id: { type: "string", description: "OAuth2 client ID" },
							client_secret: {
								type: "string",
								description: "OAuth2 client secret",
							},
							code: {
								type: "string",
								description:
									"Authorization code (for authorization_code grant)",
							},
							code_verifier: {
								type: "string",
								description:
									"PKCE code verifier (for authorization_code grant)",
							},
							redirect_uri: {
								type: "string",
								format: "uri",
								description: "Redirect URI (for authorization_code grant)",
							},
							refresh_token: {
								type: "string",
								description: "Refresh token (for refresh_token grant)",
							},
							resource: {
								type: "string",
								description:
									"Requested token resource (ie audience) to obtain a JWT formatted access token",
								enum: ["https://pb.giftedly.dev"],
							},
							scope: {
								type: "string",
								description: "Requested scopes (for client_credentials grant)",
							},
						},
						required: ["grant_type"],
					},
				},
			},
		},
		responses: {
			"200": {
				description: "Access token response",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								access_token: {
									type: "string",
									description:
										"The access token issued by the authorization server",
								},
								token_type: {
									type: "string",
									description: "The type of the token issued",
									enum: ["Bearer"],
								},
								expires_in: {
									type: "number",
									description: "Lifetime in seconds of the access token",
								},
								refresh_token: {
									type: "string",
									description: "Refresh token, if issued",
								},
								scope: {
									type: "string",
									description: "Scopes granted by the access token",
								},
								id_token: {
									type: "string",
									description: "ID Token (if OpenID Connect)",
								},
							},
							required: ["access_token", "token_type", "expires_in"],
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
