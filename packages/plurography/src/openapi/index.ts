import { PAlterObject } from "@/pluralbuddy/alter";
import { PGuildObject } from "@/pluralbuddy/guild";
import { PMessageObject } from "@/pluralbuddy/message";
import { PSystemObject } from "@/pluralbuddy/system";
import { PTagObject } from "@/pluralbuddy/tag";
import {
	OpenApiGeneratorV3,
	OpenApiGeneratorV31,
	OpenAPIRegistry,
} from "@asteasolutions/zod-to-openapi";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { YAML } from "bun";
import z from "zod";

const registry = new OpenAPIRegistry();

registry.registerPath({
	method: "get",
	path: "/v1/users/{user}/system",
	summary: "Get PluralBuddy system",
	description:
		"Get data of a PluralBuddy system. `{user}` can be `@me` to target the current OAuth user.",
	security: [{ oAuth2: ["system:read"] }],
	responses: {
		"200": {
			description: "Success response. Response with the message.",
			content: {
				"application/json": {
					schema: z.object({
						data: PSystemObject.meta({ id: "system" }),
					}),
				},
			},
		},
		"400": {
			description: "@me is the only allowed user for this endpoint.",
			content: {
				"application/json": {
					schema: z.object({
						type: z.literal("not-matching-oauth"),
						friendly: z.literal(
							"This endpoint requires the user currently logged in via OAuth.",
						),
					}),
				},
			},
		},
		"401": {
			description: "No access token when authenticating.",
			content: {
				"application/json": {
					schema: z.object({
						type: z.literal("no-access-token"),
						friendly: z.literal("no access token"),
					}),
				},
			},
		},
		"403": {
			description: "Invalid scopes while running endpoint.",
			content: {
				"application/json": {
					schema: z.object({
						type: z.literal("invalid-scopes"),
						friendly: z.string(),
					}),
				},
			},
		},
	},
});
registry.registerPath({
	method: "get",
	path: "/v1/messages/{id}",
	summary: "Get PluralBuddy message",
	security: [{ oAuth2: [] }],
	responses: {
		"200": {
			description: "Success response. Response with the message.",
			content: {
				"application/json": {
					schema: z.object({
						message: PMessageObject.extend({
							endpoints: z.object({
								system: z.string().meta({
									examples: ["api/v1/users/1481859816656736257/system"],
								}),
							}),
						}),
					}),
				},
			},
		},
		"401": {
			description: "No access token when authenticating.",
			content: {
				"application/json": {
					schema: z.object({
						type: z.literal("no-access-token"),
						friendly: z.literal("no access token"),
					}),
				},
			},
		},
		"403": {
			description: "Invalid scopes while running endpoint.",
			content: {
				"application/json": {
					schema: z.object({
						type: z.literal("invalid-scopes"),
						friendly: z.string(),
					}),
				},
			},
		},
	},
});
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
							description: "Authorization code (for authorization_code grant)",
						},
						code_verifier: {
							type: "string",
							description: "PKCE code verifier (for authorization_code grant)",
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
							description: "The token to introspect (access or refresh token)",
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

registry.registerComponent("securitySchemes", "apiKeyCookie", {
	type: "apiKey",
	in: "cookie",
	name: "apiKeyCookie",
	description: "API Key authentication via cookie",
});

registry.registerComponent("securitySchemes", "bearerAuth", {
	type: "http",
	scheme: "bearer",
	description: "Bearer token authentication",
});

registry.registerComponent("securitySchemes", "oAuth2", {
	type: "oauth2",
	description: "OAuth 2.1 authentication",
	flows: {
		authorizationCode: {
			authorizationUrl: "https://pb.giftedly.dev/api/auth/oauth2/authorize",
			tokenUrl: "https://pb.giftedly.dev/api/auth/oauth2/token",
			scopes: {
				profile: "Read profile",
				openid: "Read user ID",
				email: "Read (fake) user email",
				offline_access: "Refresh token",
				"alter:read": "Read alter data",
				"alter:write": "Write alter data",
				"tags:read": "Read tag data",
				"tags:write": "Write tag data",
				"tags:alters": "Assign tags to alters",
				"system:read": "Read system data",
				"system:write": "Write to system data",
				"system:admin": "Read/write to alter, tags & system data.",
			},
		},
		clientCredentials: {
			authorizationUrl: "https://pb.giftedly.dev/api/auth/oauth2/authorize",
			tokenUrl: "https://pb.giftedly.dev/api/auth/oauth2/token",
			scopes: {
				profile: "Read profile",
				openid: "Read user ID",
				email: "Read (fake) user email",
				offline_access: "Refresh token",
				"alter:read": "Read alter data",
				"alter:write": "Write alter data",
				"tags:read": "Read tag data",
				"tags:write": "Write tag data",
				"tags:alters": "Assign tags to alters",
				"system:read": "Read system data",
				"system:write": "Write to system data",
				"system:admin": "Read/write to alter, tags & system data.",
			},
		},
	},
});

registry.registerWebhook({
	method: "post",
	path: "alter.update",
	summary: "Receive alter updates",
	description:
		"Receive alter updates via Svix Webhooks built into PluralBuddy.",
	request: {
		body: {
			content: {
				"application/json": {
					schema: z.object({
						userId: z.string(),
						type: z.literal("alter.update"),
						alter: PAlterObject,
					}),
				},
			},
		},
	},
	responses: {},
});

registry.registerWebhook({
	method: "post",
	path: "tag.update",
	summary: "Receive tag updates",
	description: "Receive tag updates via Svix Webhooks built into PluralBuddy.",
	request: {
		body: {
			content: {
				"application/json": {
					schema: z.object({
						userId: z.string(),
						type: z.literal("tag.update"),
						tag: PTagObject,
					}),
				},
			},
		},
	},
	responses: {},
});

console.log(registry.definitions);
const generator = new OpenApiGeneratorV31(registry.definitions);
const document = generator.generateDocument({
	openapi: "3.1.0",
	info: { title: "PluralBuddy API", version: "1.0.0" },
	servers: [
		{
			url: "https://pb.giftedly.dev/api",
		},
	],
	security: [
		{
			bearerAuth: [],
			apiKeyCookie: [],
			oAuth2: [],
		},
	],
});

console.log(generator);

Bun.write(
	"../../apps/docs/./public/openapi.yml",
	YAML.stringify(document, null, 2),
);
