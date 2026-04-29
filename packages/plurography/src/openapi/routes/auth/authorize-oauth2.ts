import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const register = (registry: OpenAPIRegistry) =>
	registry.registerPath({
		method: "get",
		path: "/auth/oauth2/authorize",
		summary: "Authorize an OAuth2 request",
		security: [{ bearerAuth: [] }],
		parameters: [
			{
				name: "response_type",
				in: "query",
				required: true,
				schema: { type: "string" },
				description: "OAuth2 response type (e.g., 'code')",
			},
			{
				name: "client_id",
				in: "query",
				required: true,
				schema: { type: "string" },
				description: "OAuth2 client ID",
			},
			{
				name: "redirect_uri",
				in: "query",
				required: false,
				schema: { type: "string", format: "uri" },
				description: "OAuth2 redirect URI",
			},
			{
				name: "scope",
				in: "query",
				required: false,
				schema: { type: "string" },
				description: "OAuth2 scopes (space-separated)",
			},
			{
				name: "state",
				in: "query",
				required: false,
				schema: { type: "string" },
				description: "OAuth2 state parameter",
			},
			{
				name: "code_challenge",
				in: "query",
				required: false,
				schema: { type: "string" },
				description: "PKCE code challenge",
			},
			{
				name: "code_challenge_method",
				in: "query",
				required: false,
				schema: { type: "string" },
				description: "PKCE code challenge method",
			},
			{
				name: "nonce",
				in: "query",
				required: false,
				schema: { type: "string" },
				description: "OpenID Connect nonce",
			},
			{
				name: "prompt",
				in: "query",
				required: false,
				schema: { type: "string" },
				description: "OAuth2 prompt parameter",
			},
		],
		responses: {
			"302": {
				description: "Redirect to client with code or error",
				headers: {
					Location: {
						description: "Redirect URI with code or error",
						schema: { type: "string", format: "uri" },
					},
				},
			},
			"400": {
				description: "Invalid request",
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								error: { type: "string" },
								error_description: { type: "string" },
								state: { type: "string" },
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
