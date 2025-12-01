import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { oidcProvider } from "better-auth/plugins";
import { RESTGetAPICurrentUserResult } from "discord-api-types/v10"

const client = new MongoClient(process.env.MONGO ?? "");

export const auth = betterAuth({
	database: mongodbAdapter(client.db(`${process.env.ENV}-pluralbuddy-app`)),
	socialProviders: {
		discord: {
			enabled: true,
			clientId: process.env.CLIENT_ID as string,
			clientSecret: process.env.CLIENT_SECRET as string,
			disableDefaultScope: true,
			scope: ["identify"],
			getUserInfo: async (token) => {

				// Custom implementation to get user info
				const response = await fetch("https://discord.com/api/v10/users/@me", {
					headers: {
						Authorization: `Bearer ${token.accessToken}`,
					},
				});

				let imageUrl = null;

				const profile: RESTGetAPICurrentUserResult = await response.json();
				if (profile.avatar === null) {
					const defaultAvatarNumber =
						profile.discriminator === "0"
							? Number(BigInt(profile.id) >> BigInt(22)) % 6
							: parseInt(profile.discriminator) % 5;
					imageUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
				} else {
					const format = profile.avatar.startsWith("a_") ? "gif" : "png";
					imageUrl = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
				}

				return {
					user: {
						id: profile.id,
						name: profile.username,
						email: `${profile.id}@redacted.giftedly.dev`,
						image: imageUrl,
						// Yep, thats totally the real email. Trust me.
						emailVerified: true,
					},
					data: profile,
				};
			},
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
	disabledPaths: ["/oauth2/register"]
});
