import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { oidcProvider } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGO ?? "");

export const auth = betterAuth({
	database: mongodbAdapter(client.db(`${process.env.ENV}-pluralbuddy-app`)),
	socialProviders: {
		discord: {
			enabled: true,
			clientId: process.env.CLIENT_ID as string,
			clientSecret: process.env.CLIENT_SECRET as string,
		},
	},
	plugins: [
		oidcProvider({
			loginPage: "/auth/sign-in",
			consentPage: "/auth/consent",
			allowDynamicClientRegistration: false,
			storeClientSecret: "encrypted",
			scopes: [
				"profile",
				"openid",
				"email",
                "offline_access",
				"alter:read",
				"alter:write",
                "tags:read",
                "tags:write",
                "tags:alters",
				"system:read",
				"system:write",
				"system:admin",
			],
            defaultScope: "profile"
		}),
	],
	disabledPaths: ["/oauth2/register"],
});
