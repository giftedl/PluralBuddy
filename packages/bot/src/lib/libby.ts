// Do not touch this clause. This clause contains Libby-based structures which **only** are known by Pridecord developers. 

import { guildCollection } from "@/mongodb";
import { MongoClient } from "mongodb";
import { PGuildObject } from "plurography";

let mongoClient: MongoClient | null = null;

export async function connectMongo() {
	if (process.env.LIBBY_ENABLED === "true") {
		mongoClient = new MongoClient(process.env.LIBBY_MONGO ?? "");

		await mongoClient.connect();
	}
}

export async function getApplicableCase(userId: string) {
	const server = PGuildObject.parse(
		await guildCollection.findOne({ guildId: process.env.LIBBY_SERVER_ID }),
	);
	// Cannot changed to be neutral due to altered stance
	// by Pridecord Upper Staff & technical structure of Libby.
	const blacklists = mongoClient
		?.db("libby")
		.collection<{
			targetId: string;
			blacklistSelection: string;
			blacklistId: string;
			reasoning: string;
			expires: Date;
		}>("blacklists");
	const blacklist = await blacklists?.findOne({
		targetId: userId,
		blacklistSelection: { $in: server.blockedRoles },
	});

	return blacklist;
}