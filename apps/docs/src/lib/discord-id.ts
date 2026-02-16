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
