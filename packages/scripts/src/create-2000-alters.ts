import { DiscordSnowflake } from "@sapphire/snowflake";
import { Double, MongoClient } from "mongodb";
import { PAlterObject, type PAlter, type PUser } from "plurography";
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
const normalDb = mongodb.db("pluralbuddy-canary");
const alters = await normalDb.collection<PAlter>("alters");
const ids = [...Array(2000).keys()].map((_, i) =>{
	const date = new Date();

	date.setSeconds(i)
	return new Double(Number(DiscordSnowflake.generate({ timestamp: date, workerId: BigInt(i), processId: BigInt(Math.floor(Math.random() * 1000)) })))},
);

await normalDb
	.collection<PUser>("users")
	.updateOne({ userId: values.userId }, { $push: { "system.alterIds": { $each: ids } } });

const alterObjs = ids.map((v, i) =>
	PAlterObject.safeParse({
		alterId: Number(v),
		systemId: values.userId,

		username: `a${i}`,
		displayName: `Alter #${i}`,
		nameMap: [],
		color: null,
		pronouns: null,
		description: null,
		created: new Date(),
		avatarUrl: null,
		proxyTags: [
			{
				prefix: "",
				suffix: ` -${i}`,
				id: DiscordSnowflake.generate().toString(),
			},
		],
		webhookAvatarUrl: null,
		banner: null,
		lastMessageTimestamp: null,
		messageCount: 0,
		alterMode: "webhook",

		public: 0,
	}),
);

await alters.insertMany(
	alterObjs.filter((v) => v.data !== undefined).map((v) => v.data),
);

await mongodb.close();
