import { MongoClient } from "mongodb";
import ora from "ora";
import type { PAlter, PTag, PUser } from "plurography";
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

if (!values.userId) throw new Error("no user id");

const mongodb = new MongoClient(process.env.MONGO as string);
const normalDb = mongodb.db("pluralbuddy");
const system = await normalDb
	.collection<PUser>("users")
	.findOne({ userId: values.userId });
const alters = await normalDb
	.collection<PAlter>("alters")
	.find({ systemId: values.userId })
	.toArray();
const tags = await normalDb
	.collection<PTag>("tags")
	.find({ systemId: values.userId })
	.toArray();

await normalDb.collection<PUser>("users").updateOne(
	{ userId: values.userId },
	{
		$set: {
			"system.alterIds": alters.map((v) => v.alterId),
			"system.tagIds": tags.map((v) => v.tagId),
		},
	},
);