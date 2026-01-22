/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type Collection, type Db, MongoClient } from "mongodb"
import type { PGuild } from "./types/guild";
import type { PUser } from "./types/user";
import type { PAlter } from "./types/alter";
import type { POperation } from "./types/operation";
import type { PMessage } from "./types/message";
import type { PTag } from "./types/tag";
import type { PGuildError } from "plurography";

export let mongoClient: MongoClient;
export let mainDb: Db;
export let guildCollection: Collection<PGuild>;
export let userCollection: Collection<PUser>;
export let alterCollection: Collection<PAlter>;
export let tagCollection: Collection<PTag>;
export let operationCollection: Collection<POperation>;
export let errorCollection: Collection<PGuildError>;
export let messagesCollection: Collection<PMessage>;

export async function setupMongoDB() {
    mongoClient = new MongoClient(process.env.MONGO ?? "")

    await mongoClient.connect()
}

export async function createPeriodicExpirationDates() {

    await operationCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 1800 });
    await errorCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 21600 });

}

export async function setupDatabases() {
    mainDb = mongoClient.db(process.env.MONGO_DB)

    guildCollection = mainDb.collection("guilds")
    userCollection = mainDb.collection("users")
    alterCollection = mainDb.collection("alters")
    operationCollection = mainDb.collection("system-operations")
    messagesCollection = mainDb.collection("messages")
    tagCollection = mainDb.collection("tags")
    errorCollection = mainDb.collection("errors")

    await createPeriodicExpirationDates()
}