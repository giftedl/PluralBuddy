/**  * PluralBuddy Discord Bot  *  - is licensed under MIT License.  */

import { type Collection, Db, MongoClient } from "mongodb";
import {
	PAlterObject,
	PSystemObject,
	PTagObject,
	PUserObject,
	type PAlterOperation,
	type PExpressApplication,
	type PGuildError,
	type PImportTranscript,
	type PIntegrationFront,
} from "plurography";
import { connectMongo } from "./lib/libby";
import type { PAlter } from "./types/alter";
import type { PAnalytics } from "./types/analytics";
import type { PGuild } from "./types/guild";
import type { PMessage } from "./types/message";
import type { POperation } from "./types/operation";
import type { PTag } from "./types/tag";
import type { PUser } from "./types/user";
import { generateAlterSchema, generateTagSchema, generateUserSchema, type MongoSchema } from "./lib/db/create-db-schemas";

export let mongoClient: MongoClient;
export let mainDb: Db;
export let guildCollection: Collection<PGuild>;
export let userCollection: Collection<PUser>;
export let alterCollection: Collection<PAlter>;
export let tagCollection: Collection<PTag>;
export let operationCollection: Collection<POperation>;
export let alterOperationCollection: Collection<PAlterOperation>;
export let errorCollection: Collection<PGuildError>;
export let importTranscriptCollection: Collection<PImportTranscript>;
export let frontsCollection: Collection<PIntegrationFront>;
export let messagesCollection: Collection<PMessage>;
export let applicationsCollection: Collection<PExpressApplication>;
export let analyticsCollection: Collection<PAnalytics>;

export async function setupMongoDB() {
	mongoClient = new MongoClient(process.env.MONGO ?? "");

	await mongoClient.connect();
	await connectMongo();
}

export async function createPeriodicExpirationDates() {
	await operationCollection.createIndex(
		{ createdAt: 1 },
		{ expireAfterSeconds: 1800 },
	);
	await alterOperationCollection.createIndex(
		{ createdAt: 1 },
		{ expireAfterSeconds: 1800 },
	);
	await errorCollection.createIndex(
		{ createdAt: 1 },
		{ expireAfterSeconds: 21600 },
	);
	await importTranscriptCollection.createIndex(
		{ createdAt: 1 },
		{ expireAfterSeconds: 1800 },
	);

	await tagCollection.createIndex(
		{ tagFriendlyName: 1 },
		{
			collation: {
				locale: "en",
				strength: 2,
			},
		},
	);

	await alterCollection.createIndex({ username: "text" });
}

export async function setValidation() {
	const setValidator = async (collection: string, json: MongoSchema) => 
		await mainDb.command({
			collMod: collection,
			validator: { $jsonSchema: json },
			validationLevel: "strict",
			validationAction: "error"
		})

	await setValidator("users", generateUserSchema());
	await setValidator("alters", generateAlterSchema());
	await setValidator("tags", generateTagSchema());
}

export async function setupDatabases() {
	mainDb = mongoClient.db(process.env.MONGO_DB);

	guildCollection = mainDb.collection("guilds");
	userCollection = mainDb.collection("users");
	alterCollection = mainDb.collection("alters");
	operationCollection = mainDb.collection("system-operations");
	messagesCollection = mainDb.collection("messages");
	tagCollection = mainDb.collection("tags");
	errorCollection = mainDb.collection("errors");
	applicationsCollection = mainDb.collection("applications");
	analyticsCollection = mainDb.collection("analytics");
	alterOperationCollection = mainDb.collection("alter-operations");
	frontsCollection = mainDb.collection("fronts");
	importTranscriptCollection = mainDb.collection("import-transcripts");

	await createPeriodicExpirationDates();
	await setValidation();
}
