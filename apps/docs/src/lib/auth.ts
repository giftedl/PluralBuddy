import { oauthProvider } from "@/oauth-provider";
import { dash } from "@better-auth/infra";
import { DiscordSnowflake } from "@sapphire/snowflake";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins"
import { RESTGetAPICurrentUserResult } from "discord-api-types/v10"
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO ?? "");

export const auth = betterAuth({
	database: mongodbAdapter(client.db(`${process.env.ENV}-pluralbuddy-app`)),
	appName: "PluralBuddy",
	advanced: {
		ipAddress: {
			ipAddressHeaders: ["x-vercel-forwarded-for", "x-forwarded-for"],
		}
	},
	socialProviders: {
		discord: {
			enabled: true,
			authorizationEndpoint: "https://discord.com/oauth2/authorize?integration_type=1",
			clientId: process.env.CLIENT_ID as string,
			clientSecret: process.env.CLIENT_SECRET as string,
			
			prompt: "none",
			overrideUserInfoOnSignIn: true,
			disableDefaultScope: true,
			scope: ["identify", "applications.commands"],
			mapProfileToUser: (profile) => ({
				email: profile.email ?? `${profile.id}@discord.placeholder.invalid`,
			}),
		},
	},
	plugins: [
		jwt(),
		dash(),
		oauthProvider({
			enforcePerClientResources: false,
			customAccessTokenClaims: ({user}) => {
				return {
					sub: user?.id
				}
			},
			validAudiences: [
				process.env.BETTER_AUTH_URL ?? "",
				"https://pb.giftedly.dev"
			],
			loginPage: "/auth/sign-in",
			consentPage: "/auth/consent",
			scopes: [
				"profile",
				"openid",
				"email",
				"offline_access",
				"alters:read",
				"alters:write",
				"tags:read",
				"tags:write",
				"tags:alters",
				"system:read",
				"system:write",
				"system:admin",
				"system:ai-ap"
			],
			defaultScope: "profile",
			silenceWarnings: {
				oauthAuthServerConfig: true
			},
			generateClientId() {
				return DiscordSnowflake.generate().toString()
			},
		}),
	],
	disabledPaths: [
	  "/token",
	],
});
