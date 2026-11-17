"use server";

import { MongoClient, ObjectId } from "mongodb";
import { waitUntil } from "@vercel/functions";

export async function getDiscordIdBySessionId(userId: string) {
	const client = new MongoClient(process.env.MONGO ?? "");

	const discordAccountId = await client
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection("account")
		.findOne({ userId: new ObjectId(userId) });

	waitUntil(client.close());

	return discordAccountId?.accountId;
}

export async function getSystemIdByDiscordId(discordId: string) {
	const client = new MongoClient(process.env.MONGO ?? "");
	const users = client
		.db(`pluralbuddy${process.env.ENV === "canary" ? "-canary" : ""}`)
		.collection<{
			userId: string;
			system?: {
				associatedUserId: string;
				verifiedSubAccounts?: string[];
			};
		}>("users");
	const directUser = await users.findOne({ userId: discordId });
	const user =
		(directUser?.system ? directUser : null) ??
		(await users.findOne({ "system.verifiedSubAccounts": discordId }));

	waitUntil(client.close());

	return user?.system?.associatedUserId ?? discordId;
}

export async function getSystemIdBySessionId(userId: string) {
	const discordId = await getDiscordIdBySessionId(userId);

	return discordId ? getSystemIdByDiscordId(discordId) : undefined;
}
