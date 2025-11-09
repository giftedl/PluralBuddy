/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type Collection, type Db, MongoClient } from "mongodb"
import type { PGuild } from "./types/guild";
import type { PUser } from "./types/user";
import type { PAlter } from "./types/alter";
import type { POperation } from "./types/operation";
import type { PMessage } from "./types/message";

export let mongoClient: MongoClient;
export let mainDb: Db;
export let guildCollection: Collection<PGuild>;
export let userCollection: Collection<PUser>;
export let alterCollection: Collection<PAlter>;
export let operationCollection: Collection<POperation>;
export let messagesCollection: Collection<PMessage>;

export async function setupMongoDB() {
    mongoClient = new MongoClient(process.env.MONGO ?? "")

    await mongoClient.connect()
}

export async function setupDatabases() {
    mainDb = mongoClient.db(process.env.MONGO_DB)

    guildCollection = mainDb.collection("guilds")
    userCollection = mainDb.collection("users")
    alterCollection = mainDb.collection("alters")
    operationCollection = mainDb.collection("system-operations")
    messagesCollection = mainDb.collection("messages")
}