import { MongoClient } from "mongodb";
import type { PAlter } from "plurography";
import { parseArgs } from "util";

const { values } = parseArgs({
	args: Bun.argv,
	options: {
		userId: {
			type: "string",
		},
	},
	strict: true,
	allowPositionals: true,
});


if (!values.userId) throw new Error("no user id")

const mongodb = new MongoClient(process.env.MONGO as string);
const normalDb = mongodb.db("pluralbuddy");
const alters = normalDb.collection<PAlter>("alters")
const systemAlters = await alters.find({ systemId: values.userId }).toArray();

for (const alter of systemAlters) {
	await alters.updateMany({ alterId: alter.alterId }, { $set: { proxyTags: alter.proxyTags.slice(0, 5) }})
}

mongodb.close()