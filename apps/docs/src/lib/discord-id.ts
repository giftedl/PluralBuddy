"use server";

import { MongoClient, ObjectId } from "mongodb";
import { waitUntil } from "@vercel/functions";

export async function getDiscordIdBySessionId(userId: string, client: MongoClient) {
	const discordAccountId = await client
		.db(`${process.env.ENV}-pluralbuddy-app`)
		.collection("account")
		.findOne({ userId: new ObjectId(userId) });

	return discordAccountId?.accountId;
}
