import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

export const register = (registry: OpenAPIRegistry) => {
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
};
