/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */ /**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import {
	type PTag,
	type PGuild,
	type PUser,
	type PAlter,
	type POperation,
	type PMessage,
	defaultUserStructure,
    type PBlacklistNote,
} from "plurography";
import { type Collection, type Db, MongoClient } from "mongodb";

export let mongoClient: MongoClient;
export let mainDb: Db;
export let supportDb: Db;

export let guildCollection: Collection<PGuild>;
export let userCollection: Collection<PUser>;
export let alterCollection: Collection<PAlter>;
export let tagCollection: Collection<PTag>;
export let operationCollection: Collection<POperation>;
export let messagesCollection: Collection<PMessage>;

export let noteCollection: Collection<PBlacklistNote>

export async function setupMongoDB() {
	mongoClient = new MongoClient(process.env.MONGO ?? "");


	await mongoClient.connect();
}

export async function setupDatabases() {
	mainDb = mongoClient.db(process.env.MONGO_DB);
    supportDb = mongoClient.db(process.env.SUPPORT_MONGO_DB);

	guildCollection = mainDb.collection("guilds");
	userCollection = mainDb.collection("users");
	alterCollection = mainDb.collection("alters");
	operationCollection = mainDb.collection("system-operations");
	messagesCollection = mainDb.collection("messages");
	tagCollection = mainDb.collection("tags");

    noteCollection = supportDb.collection("blacklist-notes");
}

export async function getUserById(id: string): Promise<PUser> {
	return (
		(await userCollection.findOne({ userId: id })) ?? defaultUserStructure(id)
	);
}

export async function writeUserById(id: string, userObj: PUser) {
	return await userCollection.findOneAndReplace({ userId: id }, userObj, {
		upsert: true,
	});
}
