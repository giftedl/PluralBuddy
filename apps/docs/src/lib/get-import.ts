import { waitUntil } from "@vercel/functions";
import { MongoClient } from "mongodb";
import { ImportStage } from "plurography";

export async function getImportDataById(id: string) {
	const mongoClient = new MongoClient(process.env.MONGO ?? "");
	const mongoDb = mongoClient.db(`${process.env.ENV}-pluralbuddy-app`);

	let result = (await mongoDb
		.collection<ImportStage>("import-staging")
		.findOne({ "webhook.id": id })) as ImportStage;

	if (result) {
		result = {
			...result,
			_id: null,
			webhook: { id, token: "redacted" },
		} as ImportStage;
	}

	waitUntil(mongoClient.close());

	return result;
}
