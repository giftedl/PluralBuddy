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
const canaryDb = mongodb.db("pluralbuddy-canary");
const normalDb = mongodb.db("pluralbuddy");

const userSpinner = ora("copying user object..").start();

// user object
const user = await canaryDb
	.collection<PUser>("users")
	.findOne({ userId: values.userId });
if (!user) throw new Error("no user object ?");

await normalDb.collection<PUser>("users").insertOne(user);

userSpinner.stop();

// tags
const tagSpinner = ora("copying tags..").start();
const allTags = await canaryDb
	.collection<PTag>("tags")
	.find({ systemId: values.userId })
	.toArray();
await Promise.all(
	allTags.map(
		async (c) => await normalDb.collection<PTag>("tags").insertOne(c),
	),
);

tagSpinner.stop();

const alterSpinner = ora("copying alters..").start();

// alters
const allAlters = await canaryDb
	.collection<PAlter>("alters")
	.find({ systemId: values.userId })
	.toArray();
await Promise.all(
	allAlters.map(async (c) => {
		await normalDb.collection<PAlter>("alters").insertOne(c);
	}),
);

alterSpinner.stop();
