/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

"use server";

import { auth } from "@/lib/auth";
import { MongoClient, ObjectId, WithId } from "mongodb";
import { headers } from "next/headers";
import z from "zod";
import { createRandomStringGenerator } from "@better-auth/utils/random";
import { symmetricEncrypt } from "better-auth/crypto";
import { DiscordSnowflake } from "@sapphire/snowflake";

export const generateRandomString = createRandomStringGenerator(
	"a-z",
	"0-9",
	"A-Z",
	"-_",
);

export type OAuthApplication = {
	clientId: string;
	type: "public" | "web" | "native" | "user-agent-based";
	name: string;
	disabled: boolean;
	redirectUrls: string;
	createdAt: Date;
	updatedAt: Date;
	clientSecret?: string | undefined;
	icon?: string | undefined;
	metadata?: string | undefined;
	userId?: ObjectId | undefined;
};

export async function getUserApps() {
	const client = new MongoClient(process.env.MONGO ?? "");
	const db = client.db(`${process.env.ENV}-pluralbuddy-app`);
	const collection = db.collection<OAuthApplication>("oauthApplication");
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.user)
		return { message: "You must be authenticated to use this method." };

	const apps = collection.find({ userId: new ObjectId(session.user.id) });

	// Remove clientSecret from each application in the cursor
	const appsArr = await apps.toArray();
	const appsWithoutSecrets = appsArr.map((app) => {
		const { clientSecret, ...rest } = app;
		return rest;
	});

	return { data: appsWithoutSecrets };
}

/**
 * application is `clientId`
 */
export async function deleteUserApp(application: string) {
	const client = new MongoClient(process.env.MONGO ?? "");
	const db = client.db(`${process.env.ENV}-pluralbuddy-app`);
	const collection = db.collection<OAuthApplication>("oauthApplication");
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.user)
		return { message: "You must be authenticated to use this method." };

	const app = await collection.findOneAndDelete({
		userId: new ObjectId(session.user.id),
		clientId: application,
	});

	if (app === null) return { message: "No application was deleted." };

	return true;
}

export async function getUserApp<S extends boolean = false>(
	application: string,
	clientMode?: S,
): Promise<
	| {
			data: S extends true
				? Omit<Omit<OAuthApplication, "userId">, "_id">
				: WithId<OAuthApplication>;
	  }
	| { message: string }
> {
	const client = new MongoClient(process.env.MONGO ?? "");
	const db = client.db(`${process.env.ENV}-pluralbuddy-app`);
	const collection = db.collection<OAuthApplication>("oauthApplication");

	const data = await collection.findOne({
		clientId: application,
	});

	if (data === null) return { message: "No application was detected." };

	const { clientSecret, ...rest } = data;

	if (clientMode === true) {
		const { userId, _id, clientSecret, ...rest } = data;

        // @ts-ignore
		return { data: rest };
	}

	return { data: rest };
}

const scopes = [
	{ title: "profile", description: "Profile data – required." },
	{ title: "openid", description: "User id" },
	{ title: "email", description: "Email address access" },
	{ title: "alter:read", description: "Access to read alter data" },
	{ title: "alter:write", description: "Access to change alter settings" },
	{ title: "system:read", description: "Access to system data" },
	{ title: "system:write", description: "Access to change system settings" },
	{
		title: "system:admin",
		description: "Read and write access to systems AND alters.",
	},
] as const;

const urlRegex =
	/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;

const formSchema = z.object({
	applicationName: z.string().max(90).min(3),
	redirectUris: z.string().regex(urlRegex).max(300).array().max(10),
	scopes: z.enum(scopes.map((c) => c.title)).array(),
});

export async function registerOAuthApplication(
	application: z.infer<typeof formSchema>,
) {
	const parsed = formSchema.safeParse(application);

	if (parsed.error) return { message: parsed.error };

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.user)
		return { message: "You must be authenticated to use this method." };

	const clientId = String(DiscordSnowflake.generate());
	const clientSecret = generateRandomString(32, "a-z", "A-Z");

	const client = new MongoClient(process.env.MONGO ?? "");
	const db = client.db(`${process.env.ENV}-pluralbuddy-app`);
	const collection = db.collection<OAuthApplication>("oauthApplication");

	const createdObject = {
		name: parsed.data.applicationName,
		redirectUrls: parsed.data.redirectUris.join(","),
		type: "web" as "web",
		metadata: JSON.stringify({ scopes: parsed.data.scopes.join(" ") }),
		clientId,
		disabled: false,
		authenticationScheme: "client_secret_basic",
		clientSecret: await symmetricEncrypt({
			key: (await auth.$context).secret,
			data: clientSecret,
		}),
		userId: new ObjectId(session?.session.userId),
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	await collection.insertOne(createdObject);

	return { clientId: createdObject.clientId };
}
