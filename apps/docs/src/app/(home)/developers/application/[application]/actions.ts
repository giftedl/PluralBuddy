"use server";

import { MongoClient, ObjectId } from "mongodb";
import { OAuthApplication } from "../../applications/actions";
import { generateRandomString, symmetricEncrypt } from "better-auth/crypto";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import z from "zod";
import { urlRegex } from "@/components/devs/create-new-app-form";

export async function generateNewSecret(applicationId: string) {
	const client = new MongoClient(process.env.MONGO ?? "");
	const db = client.db(`${process.env.ENV}-pluralbuddy-app`);
	const collection = db.collection<OAuthApplication>("oauthApplication");
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.user)
		return { message: "You must be authenticated to use this method." };

	const clientSecret = generateRandomString(32, "a-z", "A-Z");

	const updated = await collection.updateOne(
		{
			userId: new ObjectId(session.user.id),
			clientId: applicationId,
		},
		{
			$set: {
				clientSecret: await symmetricEncrypt({
					key: (await auth.$context).secret,
					data: clientSecret,
				}),
			},
		},
	);

	if (updated.modifiedCount === 0)
		return { message: "No application was detected." };

	return { clientSecret };
}

const redirectUriSchema = z
	.string()
	.regex(
		/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
	)
	.max(300)
	.array()
	.max(10);

export async function changeRedirectURIs(
	applicationId: string,
	newRedirectArray: z.infer<typeof redirectUriSchema>,
) {
	const parsed = redirectUriSchema.safeParse(newRedirectArray);

	if (parsed.error) return { message: parsed.error };

	const client = new MongoClient(process.env.MONGO ?? "");
	const db = client.db(`${process.env.ENV}-pluralbuddy-app`);
	const collection = db.collection<OAuthApplication>("oauthApplication");
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || !session.user)
		return { message: "You must be authenticated to use this method." };

	const clientSecret = generateRandomString(32, "a-z", "A-Z");

	const updated = await collection.updateOne(
		{
			userId: new ObjectId(session.user.id),
			clientId: applicationId,
		},
		{
			$set: {
				redirectUrls: newRedirectArray.join(","),
			},
		},
	);

	if (updated.modifiedCount === 0)
		return { message: "No application was detected." };

	return { clientSecret };
}
